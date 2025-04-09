"use client";
import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { generateChatResponse } from "@/utils/ChatGPTAIModal"; // Import ChatGPT function
import { LoaderCircle, Sparkles, Trash } from "lucide-react";
import { MockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/utils/db";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { eq, sql } from "drizzle-orm";

import { TechStack } from "@/utils/schema";

// Job Role Suggestions
let JOB_ROLE_SUGGESTIONS = [];

function TechStackComponent({ isOpen }) {
    const [openDialog, setOpenDialog] = useState(isOpen || false);
    const [jobPosition, setJobPosition] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [jobExperience, setJobExperience] = useState("");
    const [questions, setQuestions] = useState(5);
    const [loading, setLoading] = useState(false);
    const { user } = useUser();
    const [techStacks, setTechStacks] = useState([]);
    const router = useRouter();

    useEffect(() => {
        getTechStacks();
    }, []);

    const getTechStacks = async () => {
        const techStackRecord = await db
            .select()
            .from(TechStack)
            .execute();

        const updatedTechStacks = techStackRecord.map(t => ({
            id: t.id,
            techStack: t.techStack,
            suggestions: t.suggestions,
        }));

        setTechStacks(updatedTechStacks); // Update state with the new array

        console.log("Tech Stack: ", updatedTechStacks);
    };

    // Auto-suggest tech stack based on job role
    const autoSuggestTechStack = (role) => {
        // const suggestion = TECH_STACK_SUGGESTIONS[role];
        if (techStacks[role]) {
            setJobDescription(techStacks[role]);
            toast.info(`Auto-filled tech stack for ${role}`);
        }
    };

    const addNewTechStack = () => {
        setTechStacks(prev => [
            { id: uuidv4(), techStack: "", suggestions: "" },
            ...prev,
        ]);
    };

    const deleteTechStack = (id) => {
        setTechStacks(prev => prev.filter(techStack => techStack.id !== id));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Get the current tech stacks from the DB
            const currentTechStacks = await db
                .select()
                .from(TechStack)
                .execute();

            // Create a map of the current IDs for easier comparison
            const currentTechStackIds = new Set(currentTechStacks.map((stack) => stack.id));

            // Create the list of IDs from the new state (techStacks)
            const newTechStackIds = new Set(techStacks.map((stack) => stack.id));

            // Step 1: Find deleted records (IDs in DB but not in the new state)
            const idsToDelete = [...currentTechStackIds].filter(id => !newTechStackIds.has(id));

            // Step 2: Find new records (IDs in the new state but not in DB)
            let newRecordsToInsert = techStacks.filter(stack => !currentTechStackIds.has(stack.id));

            // Step 3: Find records that need to be updated (present in both the DB and the new state)
            const updatedRecords = techStacks.filter(stack => currentTechStackIds.has(stack.id));

            // Handle deletion in a single query if there are IDs to delete
            if (idsToDelete.length > 0) {
                let query = db.delete(TechStack);

                // Loop through the `idsToDelete` array and chain the `.where()` calls
                for (let i = 0; i < idsToDelete.length; i++) {
                    query = query.where(eq(TechStack.id, idsToDelete[i]));
                }

                await query.execute();

            }

            // Handle insertion of new records (batch insert if applicable)
            if (newRecordsToInsert.length > 0) {
                console.log("before: ", newRecordsToInsert);
                newRecordsToInsert = newRecordsToInsert.map((el) => ({
                    techStack: el.techStack,
                    suggestions: el.suggestions,
                    createdBy: user?.primaryEmailAddress?.emailAddress,
                    createdAt: moment().format("DD-MM-YYYY"),
                }));

                console.log("after: ", newRecordsToInsert);

                await db
                    .insert(TechStack)
                    .values(newRecordsToInsert)
                    .execute();
            }

            // Handle updating existing records in bulk
            if (updatedRecords.length > 0) {
                const updatePromises = updatedRecords.map((el) => {
                    return db
                        .update(TechStack)
                        .set({
                            techStack: el.techStack,
                            suggestions: el.suggestions,
                            createdAt: moment().format("DD-MM-YYYY"),
                        })
                        .where(eq(TechStack.id, el.id))
                        .execute();
                });

                // Use Promise.all to run all update operations at once
                await Promise.all(updatePromises);

            }


            // OLD

            // await db
            //     .update(TechStack)
            //     .set({
            //         techStack: jobPosition,
            //         suggestions: jobDescription,
            //         createdBy: user?.primaryEmailAddress?.emailAddress,
            //         createdAt: moment().format("DD-MM-YYYY"),
            //     })
            //     .where(eq(TechStack.id, techStacks[0]?.id));

            toast.success("Tech Stacks updated successfully!");
            router.push("/dashboard/");
        } catch (error) {
            console.error("Error updating Tech Stacks:", error);
            toast.error("Failed to update Tech Stacks.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div
                className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
                onClick={() => setOpenDialog(true)}
            >
                <h1 className="font-bold text-lg text-center">Tech Stacks</h1>
            </div>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="max-w-2xl max-h-[80%] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="font-bold text-2xl">
                            Tech Stack Management
                        </DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                        <form onSubmit={onSubmit}>
                            <div>
                                <div className="text-right">
                                    <Button type="button" variant="link" className="font-bold" onClick={addNewTechStack}>
                                        + Add New Tech Stack
                                    </Button>
                                </div>
                                {techStacks.map((techStack, index) => (
                                    <div key={techStack.id} className="mt-7 my-3">
                                        <div className="flex items-center space-x-1 md:space-x-2">
                                            <div className="space-y-4">
                                                <div className="flex items-center">
                                                    <span className="py-5 px-4 md:px-5 md:text-lg text-sm text-black bg-white w-4 h-4 md:w-8 md:h-8 flex items-center justify-center rounded-md shadow-sm hover:shadow-md">
                                                        {index + 1}
                                                    </span>
                                                </div>
                                            </div>
                                            <Input
                                                placeholder="Ex. Full Stack Developer"
                                                className="w-1/2"
                                                value={techStack.techStack}
                                                onChange={(e) => {
                                                    const newTechStacks = [...techStacks];
                                                    newTechStacks[index].techStack = e.target.value;
                                                    setTechStacks(newTechStacks);
                                                }}
                                                required
                                            />
                                            <Input
                                                placeholder="Ex. Java"
                                                value={techStack.suggestions}
                                                onChange={(e) => {
                                                    const newTechStacks = [...techStacks];
                                                    newTechStacks[index].suggestions = e.target.value;
                                                    setTechStacks(newTechStacks);
                                                }}
                                                required
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="p-2 md:p-3 text-red-700 hover:text-red-600 hover:bg-red-100 font-bold"
                                                onClick={() => deleteTechStack(techStack.id)}
                                            >
                                                <Trash />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="sticky bottom-0 bg-white bg-opacity-60 z-10 flex gap-5 justify-end p-2 mt-4">
                                <Button type="button" variant="ghost" onClick={getTechStacks}>
                                    Restore
                                </Button>
                                <Button type="submit" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <LoaderCircle className="animate-spin mr-2" /> Updating
                                        </>
                                    ) : (
                                        "Update Tech Stacks"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </DialogDescription>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default TechStackComponent;

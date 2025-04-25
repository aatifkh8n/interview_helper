import React from "react";
import Header from "./_components/Header";
import Footer from "./_components/Footer";

function DashboardLayout({ children }) {
  return (
    <div>
      <Header />
      <main className="container mx-auto my-8 px-4">{children}</main>
    </div>
  );
}

export default DashboardLayout;

// "use client";

// import React, { useEffect, useState } from "react";
// import { useUser } from "@clerk/nextjs";
// import { toast } from "sonner";
// import { Bot, ListChecks, Trophy, Zap, TrendingUp } from "lucide-react";

// import InterviewCard from "./_components/InterviewCard";
// import InterviewList from "./_components/InterviewList";
// import LineChartCard from "./_components/LineChartCard";
// import PieChartCard from "./_components/PieChartCard";
// import TechStackCard from "./_components/TechStackCard";
// import { Button } from "@/components/ui/button";
// // import  LgCard  from '@/components/ui/Card';

// function Dashboard() {
//   const { user } = useUser();
//   const [isNewInterviewModalOpen, setIsNewInterviewModalOpen] = useState(false);
//   const [interviews, setInterviews] = useState([]);
//   const [statsCards, setStatsCards] = useState([
//     {
//       icon: <img src="/images/statsCards/qna.svg" alt="qna" width="35" />,
//       title: "Total Interview Question",
//       value: "0",
//     },
//     {
//       icon: <img src="/images/statsCards/award.svg" alt="award" width="35" />,
//       title: "Best Score",
//       value: "N/A",
//     },
//     {
//       icon: (
//         <img
//           src="/images/statsCards/improvement.svg"
//           alt="improvement"
//           width="35"
//         />
//       ),
//       title: "Improvement Rate",
//       value: "0%",
//     },
//   ]);

//   const fetchInterviews = async () => {
//     if (!user?.primaryEmailAddress?.emailAddress) {
//       toast.error("User email not found");
//       return;
//     }

//     try {
//       const response = await fetch("/api/fetchUserData", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           createdBy: user.primaryEmailAddress.emailAddress,
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to fetch interview data");
//       }

//       const data = await response.json();

//       // Filter interviews specific to the current user's email
//       const userSpecificInterviews = data.interviews.filter(
//         (interview) =>
//           interview.createdBy === user.primaryEmailAddress.emailAddress
//       );

//       // console.log("userSpecificInterviews:", userSpecificInterviews);
//       // setInterviews(userSpecificInterviews);

//       // Calculate and update stats
//       const totalInterviews = userSpecificInterviews.length;
//       const bestScore =
//         totalInterviews > 0
//           ? Math.max(
//               ...userSpecificInterviews.map((item) =>
//                 parseInt(item.rating || "0")
//               )
//             )
//           : 0;
//       const improvementRate = calculateImprovementRate(userSpecificInterviews);

//       setStatsCards([
//         {
//           ...statsCards[0],
//           value: totalInterviews.toString(),
//         },
//         {
//           ...statsCards[1],
//           value: bestScore ? `${bestScore}/10` : "N/A",
//         },
//         {
//           ...statsCards[2],
//           value: `${improvementRate}%`,
//         },
//       ]);

//       if (totalInterviews > 0) {
//         toast.success(`Loaded ${totalInterviews} interview(s)`);
//       }
//     } catch (error) {
//       console.error("Error fetching interviews:", error);
//       toast.error(error.message || "Failed to fetch interviews");
//     }
//   };

//   useEffect(() => {
//     console.log("Updated interviews:", interviews);
//   }, [interviews]);

//   const calculateImprovementRate = (interviews) => {
//     if (interviews.length <= 1) return 0;

//     const scores = interviews
//       .map((interview) => parseInt(interview.rating || "0"))
//       .sort((a, b) => a - b);

//     const improvement =
//       ((scores[scores.length - 1] - scores[0]) / scores[0]) * 100;
//     return Math.round(improvement);
//   };

//   useEffect(() => {
//     if (user?.primaryEmailAddress?.emailAddress) {
//       fetchInterviews();
//     }
//   }, [user]);

//   return (
//     <div className="container mx-auto px-4 py-8 max-w-7xl">
//       {/* User Greeting */}
//       <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
//         <div>
//           <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-3">
//             Dashboard
//           </h2>
//           <h3 className="text-lg sm:text-xl text-gray-600 mt-2">
//             Welcome,{" "}
//             <span className="text-primaryColor-level2">
//               {user?.firstName || "Interviewer"}
//             </span>
//           </h3>
//         </div>
//         <div className="flex items-center gap-4">
//           <span className="text-gray-500 text-sm sm:text-base">
//             {user?.primaryEmailAddress?.emailAddress || "Not logged in"}
//           </span>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
//         {statsCards.map((card) => (
//           <div
//             key={card.title}
//             className="bg-white border-2 p-4 !px-[3rem] sm:p-6 rounded-lg hover:shadow-md transition-all flex items-center"
//           >
//             {card.icon}
//             <div className="ml-4">
//               <p className="text-xs sm:text-sm text-gray-500">{card.title}</p>
//               <p className="text-xl sm:text-2xl font-bold text-primaryColor">
//                 {card.value}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Graphs section */}
//       <div className="grid lg:grid-cols-9 grid-cols-1 gap-5 min-h-64">
//         <div className="bg-primaryColor-level4 border-2 bg-opacity-10 mb-7 p-4 sm:p-6 rounded-lg hover:shadow-md lg:col-span-3">
//           <LineChartCard />
//         </div>
//         <div className="bg-primaryColor-level4 border-2 bg-opacity-10 mb-7 p-4 sm:p-6 rounded-lg hover:shadow-md lg:col-span-4">
//           <PieChartCard />
//         </div>
//         <div className="bg-gray-300 border-2 mb-7 p-4 sm:p-6 rounded-lg hover:shadow-md lg:col-span-2">
//           <TechStackCard />
//         </div>
//       </div>

//       {/* Interview Section */}
//       <div className="bg-gray-200 mt-5 px-10 lg:py-5 py-6 rounded-lg">
//         <div className="flex flex-col sm:flex-row items-center justify-between mb-3 space-y-4 sm:space-y-0">
//           <h2 className="text-xl sm:text-2xl font-semibold text-primaryColor-level2 flex items-center gap-3">
//             <img src="/images/stars.svg" alt="stars" />
//             Create AI Mock Interview
//           </h2>
//         </div>
//         <div className="md:text-left text-center">
//           Select an interview type to continue
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-3">
//           {/* Add New Interview Component */}
//           <InterviewCard
//             heading="💼 Job Interview"
//             description="Role-specific interview questions to ace your next job opportunity."
//           />
//           <InterviewCard
//             heading="📚 Thesis Defense"
//             description="Get ready to defend your research with confidence. Simulate academic questions and critical discussions."
//           />
//           <InterviewCard
//             heading="🎓 Education Interview"
//             description="Navigate typical interview formats for admissions, scholarships, or academic programs."
//           />
//         </div>
//       </div>

//       {/* Interview History */}
//       <div className="mt-8">
//         <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6">
//           Your Recent Interviews
//           <Button
//             size="sm"
//             className="ml-auto float-right bg-primaryColor hover:bg-primaryColor-level1"
//           >
//             View all
//           </Button>
//         </h2>
//         <InterviewList
//           interviews={interviews}
//           type={0}
//           heading={"Previous Mock Interviews"}
//         />
//         {/* <InterviewList
//           type={1}
//           heading={"File-based Mock Interviews"}
//         /> */}
//       </div>
//     </div>
//   );
// }

// export default Dashboard;

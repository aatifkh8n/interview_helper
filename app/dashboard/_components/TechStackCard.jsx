import { ExternalLink, Layers } from "lucide-react";

export default function TechStackCard() {
  const roles = [
    {
      title: "UI/UX Designer",
      stack: ["Figma", "Sketch", "Adobe XD"],
    },
    {
      title: "Mobile App Developer",
      stack: ["React Native", "Flutter", "Swift"],
    },
    {
      title: "Cloud Engineer",
      stack: ["AWS", "Azure", "GCP", "Terraform"],
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Layers className="text-primaryColor" size={18} />
          <h3 className="text-base font-semibold">Tech Stack</h3>
        </div>
        <a
          href="/tech-stack"
          className="text-primaryColor hover:underline"
          title="Visit full page"
        >
          <ExternalLink size={16} />
        </a>
      </div>

      {/* Role List */}
      <div className="space-y-1">
        {roles.map((role, index) => (
          <div
            key={index}
            className="bg-white border rounded-lg p-2 shadow-sm hover:shadow-md transition"
          >
            <h4 className="font-medium text-sm">{role.title}</h4>
            <p className="text-xs text-purple-700 flex flex-wrap gap-1">
              {role.stack.map((tech, idx) => (
                <span
                  key={idx}
                  className="after:content-[','] last:after:content-['']"
                >
                  {tech}
                </span>
              ))}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

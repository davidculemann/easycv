import type { FullCVContext } from "@/lib/documents/types";

export function generateLatexTemplate(data: FullCVContext) {
	const { firstName, lastName, email, phone, website, linkedin, github, education, experience, skills, projects } =
		data;

	const userName = `${firstName || ""} ${lastName || ""}`.trim() || "Your Name";
	const userEmail = email || "email@example.com";
	const userPhone = phone || "";
	const userWebsite = website || "";
	const userLinkedin = linkedin || "";
	const userGithub = github || "";

	const siteConfig = {
		name: "easycv",
		project: "EasyCV",
		url: "https://easycv.vercel.app/",
	};

	return `\\documentclass[letterpaper,11pt]{article}

\\usepackage[
    ignoreheadfoot,
    top=2 cm,
    bottom=2 cm,
    left=2 cm,
    right=2 cm,
    footskip=1.0 cm,
]{geometry}
\\usepackage{titlesec}
\\usepackage{tabularx}
\\usepackage{array}
\\usepackage{enumitem}
\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{enumitem}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\usepackage{textcomp}
\\usepackage{amsmath}
\\usepackage[dvipsnames]{xcolor}
\\definecolor{primaryColor}{RGB}{0, 79, 144}
\\input{glyphtounicode}
\\pagecolor{white}
\\usepackage[
    pdftitle={${escapeLatex(userName)} CV},
    pdfauthor={${escapeLatex(userName)}},
    pdfcreator={${escapeLatex(siteConfig.project)}},
    colorlinks=true,
    urlcolor=primaryColor
]{hyperref}
\\usepackage{calc}
\\usepackage{bookmark}
\\usepackage{lastpage}
\\usepackage{changepage}
\\usepackage{paracol}
\\usepackage{ifthen}
\\usepackage{needspace}
\\usepackage{iftex}

\\pagestyle{fancy}
\\fancyhf{}
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

% Adjust margins
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Sections formatting
\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

% Ensure that generate pdf is machine readable/ATS parsable
\\pdfgentounicode=1

%-------------------------
% Custom commands

\\renewcommand\\labelitemi{$\\circ$}

\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubheadingFormatted}[2]{
  \\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
    \\end{tabular*}\\vspace{-9pt}
}

\\newcommand{\\resumeSubSubheadingFormatted}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\textit{\\small#1} & \\textit{\\small#2} \\\\
    \\end{tabular*}\\vspace{-9pt}
}

\\newcommand{\\resumeSubSubheading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\textit{\\small#1} & \\textit{\\small #2} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & #2 \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}

\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

\\begin{document}

\\begin{center}
  \\textbf{\\Huge \\scshape ${escapeLatex(userName)}} \\\\ \\vspace{1pt}
  \\small ${escapeLatex(userPhone)}
  ${userPhone && userEmail ? "\\hspace{2pt}" : ""}
  ${userEmail ? `\\href{mailto:${escapeLatex(userEmail)}}{${escapeLatex(userEmail)}}` : ""}
  ${(userPhone || userEmail) && userWebsite ? "\\hspace{2pt}" : ""}
  ${userWebsite ? `\\href{${escapeLatex(userWebsite)}}{${escapeLatex(userWebsite)}}` : ""}
  ${
		userLinkedin
			? `\\hspace{2pt}
  \\mbox{\\href{${escapeLatex(userLinkedin)}}{\\color{black}{\\footnotesize\\faLinkedin}\\hspace*{0.13cm}}}`
			: ""
  }
  ${
		userGithub
			? `\\hspace{2pt}
  \\mbox{\\href{${escapeLatex(userGithub)}}{\\color{black}{\\footnotesize\\faGithub}\\hspace*{0.13cm}}}`
			: ""
  }
\\end{center}

%-----------EDUCATION-----------
\\section{Education}
  \\resumeSubHeadingListStart
  ${
		education.length > 0
			? education
					.map(
						(edu) => `
  \\resumeSubheading
  {${escapeLatex(edu.school)}}{${escapeLatex(edu.location || "")}}
  {${escapeLatex(edu.degree)}}{${escapeLatex(edu.startDate)} -- ${escapeLatex(edu.endDate || "Present")}}
  ${
		edu.description
			? `
      \\resumeItemListStart
         \\resumeItem{${escapeLatex(edu.description)}}
      \\resumeItemListEnd`
			: ""
  }
  `,
					)
					.join("\n")
			: "\\resumeSubheading{No education listed}{}{}{}"
  }
  \\resumeSubHeadingListEnd

%-----------SKILLS-----------
\\section{Technical Knowledge}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
      ${formatSkillsForLatex(skills)}
    }}
 \\end{itemize}

%-----------EXPERIENCE-----------
\\section{Industrial Experience}
    \\resumeSubHeadingListStart
    ${
		experience.length > 0
			? experience
					.map(
						(exp) => `
    \\resumeSubheadingFormatted{${escapeLatex(exp.company)}}{${escapeLatex(exp.location || "")}}
     \\resumeSubSubheadingFormatted{${escapeLatex(exp.role)}}{${escapeLatex(exp.startDate)} -- ${escapeLatex(exp.endDate || "Present")}}
     ${
			exp.description
				? `
     \\resumeItemListStart
       \\resumeItem{${escapeLatex(exp.description)}}
     \\resumeItemListEnd`
				: ""
		}
    `,
					)
					.join("\n\n")
			: "\\resumeSubheadingFormatted{No experience listed}{}"
	}
    \\resumeSubHeadingListEnd

%-----------PROJECTS-----------
\\section{Projects}
    \\resumeSubHeadingListStart
    ${
		projects.length > 0
			? projects
					.map(
						(project) => `
      \\resumeProjectHeading
      {\\textbf{${escapeLatex(project.name)}}} {${escapeLatex(project.startDate)} -- ${escapeLatex(project.endDate || "Present")}}
      ${
			project.description
				? `
      \\resumeItemListStart
        \\resumeItem{${escapeLatex(project.description)}}
      \\resumeItemListEnd`
				: ""
		}
    `,
					)
					.join("\n")
			: "\\resumeProjectHeading{No projects listed}{}"
	}
    \\resumeSubHeadingListEnd

\\end{document}
`;
}

// Format skills in a clean way for LaTeX
function formatSkillsForLatex(skills: string[]): string {
	// Group skills by category if they follow a pattern like "Category: Skill1, Skill2"
	const skillMap = new Map<string, string[]>();
	const uncategorizedSkills: string[] = [];

	skills.forEach((skill) => {
		if (skill.includes(":")) {
			const [category, skillList] = skill.split(":").map((s) => s.trim());
			if (!skillMap.has(category)) {
				skillMap.set(category, []);
			}
			skillMap.get(category)?.push(skillList);
		} else {
			uncategorizedSkills.push(skill);
		}
	});

	let result = "";

	// Add categorized skills
	if (skillMap.size > 0) {
		skillMap.forEach((skills, category) => {
			result += `\\textbf{${escapeLatex(category)}:} ${escapeLatex(skills.join(", "))}\\\\`;
		});
	}

	// Add uncategorized skills in Frontend/Backend format to match your CV
	if (uncategorizedSkills.length > 0) {
		if (skillMap.size > 0) result += "\\\\"; // Add separation if there were categorized skills

		// Split skills into two groups to mimic your CV format
		const halfwayIndex = Math.ceil(uncategorizedSkills.length / 2);
		const firstHalf = uncategorizedSkills.slice(0, halfwayIndex);
		const secondHalf = uncategorizedSkills.slice(halfwayIndex);

		result += `\\textbf{Frontend:} ${escapeLatex(firstHalf.join(", "))}\\\\`;
		result += `\\textbf{Backend:} ${escapeLatex(secondHalf.join(", "))}`;
	}

	return result || "No skills listed";
}

// Escape special LaTeX characters to prevent compilation errors
function escapeLatex(text: string): string {
	if (!text) return "";

	return text
		.replace(/\\/g, "\\textbackslash{}")
		.replace(/&/g, "\\&")
		.replace(/%/g, "\\%")
		.replace(/\$/g, "\\$")
		.replace(/#/g, "\\#")
		.replace(/_/g, "\\_")
		.replace(/\{/g, "\\{")
		.replace(/\}/g, "\\}")
		.replace(/~/g, "\\textasciitilde{}")
		.replace(/\^/g, "\\textasciicircum{}");
}

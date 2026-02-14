// import express from 'express';
// import { getAnnouncements, getStudentSchedule, getKnowledgeBase, getDepartmentDocuments } from '../controllers/studentController';
// import { protect } from '../middlewares/auth';

// const router = express.Router();

// router.use(protect);

// router.get('/news', getAnnouncements);
// router.get('/schedule', getStudentSchedule);


// router.get('/documents', getDepartmentDocuments);

// export default router;


import express from 'express';
import { protect } from '../middlewares/auth';
// Import your existing controllers for other routes
import { getAnnouncements, getStudentSchedule } from '../controllers/studentController';

const router = express.Router();

// The Data extracted from the PDF
const DEPARTMENT_DATA: Record<string, any> = {
  'CoEEC': {
  description: "The College of Electrical Engineering and Computing (CoEEC) focuses on computing, software development, electronics, communication systems, and power engineering. It is a major hub for students interested in technology, programming, embedded systems, and electrical infrastructure. The college provides strong academic and practical training in areas such as software engineering, computer networking, artificial intelligence, cybersecurity, automation, and electrical power systems. Students gain hands-on experience through laboratories, real-world projects, and industry-oriented learning that prepares them for careers in technology companies, telecom industries, power and energy sectors, and research institutions. CoEEC is well known for producing graduates who contribute to digital transformation, smart systems development, and modern electrical solutions for industries and society.",
  departments: ['Software Engineering (SE)', 'Computer Science and Engineering (CSE)', 'Electronics and Communication Engineering (ECE)', 'Electrical Power and Control Engineering (EPCE)'],
  focus: ['Software Dev', 'Power Systems', 'AI & Computing', 'Telecommunications']
},

'CoCCA': {
  description: "The College of Civil and Construction Engineering (CoCCA) is responsible for training engineers who design and build infrastructure such as buildings, roads, bridges, dams, and water supply systems. It is ideal for students who are interested in construction, structural design, and urban development. The college equips students with strong engineering knowledge in surveying, construction technology, transportation systems, structural analysis, and environmental planning. Students learn how to manage large construction projects, ensure safety and quality standards, and design infrastructure that supports economic development and community growth. The program combines theoretical learning with practical fieldwork, laboratory activities, and engineering design projects, preparing graduates to work in construction companies, government development projects, and consultancy firms.",
  departments: ['Civil Engineering', 'Water Engineering', 'Architectural Engineering'],
  focus: ['Urban Design', 'Structural Integrity', 'Hydraulic Systems', 'Infrastructure']
},

'CoMME': {
  description: "The College of Mechanical and Manufacturing Engineering (CoMME) focuses on the design, production, and maintenance of machines, manufacturing systems, industrial processes, and materials. Students in this school often work with mechanical design, thermodynamics, industrial production, and advanced manufacturing techniques. The college provides training in machine design, energy systems, industrial automation, chemical processing, and material development. Students gain practical exposure through workshops, laboratories, industrial projects, and engineering simulations that help them understand how machines and manufacturing systems operate in real industries. Graduates are prepared for careers in automotive industries, manufacturing plants, energy production companies, mechanical maintenance sectors, chemical processing industries, and research organizations.",
  departments: ['Material Engineering', 'Chemical Engineering', 'Mechanical Engineering'],
  focus: ['Machine Design', 'Thermodynamics', 'Process Engineering', 'Materials Science']
},

'Applied Mathematics': {
  description: "Applied Mathematics focuses on mathematical modeling, statistics, computational methods, and problem-solving techniques used in science and engineering. It helps students develop strong analytical thinking and logical reasoning skills to solve complex real-world problems. The program emphasizes the use of mathematical tools in areas such as data analysis, optimization, simulations, economics, engineering systems, and scientific research. Students learn how to apply mathematical theories to technology and industry-based challenges, including prediction models, decision-making systems, and algorithm development. Applied Mathematics is also a strong foundation for careers in data science, artificial intelligence, research, finance, and engineering-related fields.",
  focus: ['Statistical Analysis', 'Computational Modeling', 'Quantitative Research']
},

'Applied Physics': {
  description: "Applied Physics covers physical principles and practical applications such as mechanics, electricity, optics, materials science, and experimental physics. The program combines theoretical physics with hands-on laboratory experience to help students understand how physical laws are applied in engineering and modern technology. Students study areas such as quantum mechanics, electronics, electromagnetic systems, and material behavior, which are essential in fields like telecommunications, energy systems, semiconductor technology, and scientific instrumentation. Applied Physics prepares students for careers in research institutions, technology industries, energy-related projects, and engineering development fields where strong physics knowledge is required.",
  focus: ['Quantum Mechanics', 'Optics', 'Condensed Matter', 'Electronics']
},

'Pharmacy': {
  description: "Pharmacy prepares students for healthcare and pharmaceutical sciences, including drug development, clinical pharmacy, and patient-centered healthcare support. The program trains students to understand how medicines are discovered, produced, tested, and safely used to treat diseases. Students learn about pharmacology, biochemistry, toxicology, drug formulation, and clinical practices, allowing them to support healthcare professionals and improve patient treatment outcomes. The field also involves strong laboratory training and research skills for developing new drugs and improving existing medications. Graduates can work in hospitals, pharmacies, pharmaceutical industries, medical research centers, and public health organizations.",
  focus: ['Pharmacology', 'Drug Discovery', 'Clinical Care', 'Biochemistry']
},

'Applied Chemistry': {
  description: "Applied Chemistry deals with chemical reactions, laboratory experiments, analytical techniques, and the application of chemistry in industries and research. The program provides strong laboratory-based learning, helping students understand chemical structures, reaction mechanisms, and chemical product development. Students gain practical experience in chemical analysis, quality control, and industrial chemical processing. Applied Chemistry is important in many sectors including pharmaceuticals, agriculture, food processing, manufacturing industries, and environmental protection. Graduates are prepared for careers in laboratory research, chemical industries, industrial production companies, and scientific innovation fields.",
  focus: ['Organic Chemistry', 'Analytical Methods', 'Industrial Lab Work']
},

'Applied Biology': {
  description: "Applied Biology studies living organisms, genetics, microbiology, ecology, and laboratory-based biological research. It focuses on understanding biological systems and applying this knowledge in healthcare, agriculture, environmental protection, and biotechnology industries. Students learn about human biology, plant and animal systems, microorganisms, genetics, and modern biotechnology methods. The program emphasizes practical laboratory work, scientific research skills, and real-world applications such as disease control, food production improvement, environmental sustainability, and genetic studies. Graduates can work in laboratories, hospitals, agricultural industries, environmental agencies, and biotechnology research organizations.",
  focus: ['Genetics', 'Microbiology', 'Ecological Systems', 'Biotechnology']
},

'Applied Geology': {
  description: "Applied Geology focuses on earth sciences, mineral resources, environmental geology, geotechnical studies, and geological fieldwork. Students learn about the formation of rocks and minerals, geological structures, earthquakes, and soil behavior. The program includes field-based training where students conduct geological mapping, mineral exploration, and environmental assessments. Applied Geology is essential for natural resource development, mining operations, construction projects, and environmental protection. Graduates are prepared for careers in mining companies, construction and infrastructure development projects, environmental consulting, geological survey institutions, and research organizations.",
  focus: ['Mineralogy', 'Seismology', 'Geotechnical Engineering', 'Resources']
},

'Industrial Chemistry': {
  description: "Industrial Chemistry specializes in chemical processes used in industries, production of chemicals, quality control, and industrial laboratory practices. It focuses on large-scale chemical manufacturing and the transformation of raw materials into useful chemical products for industries such as pharmaceuticals, plastics, food production, and agriculture. Students learn how industrial chemical plants operate, how production processes are managed, and how quality standards are maintained. The program also emphasizes chemical safety, industrial waste management, and process optimization. Graduates can work in chemical industries, manufacturing plants, quality assurance departments, laboratory research centers, and industrial production companies.",
  focus: ['Quality Assurance', 'Chemical Manufacturing', 'Polymer Science']
}

};

router.use(protect);

router.get('/news', getAnnouncements);
router.get('/schedule', getStudentSchedule);

// ENHANCED ROUTE: Returns both the Text Data and the File Documents
router.get('/documents', async (req, res) => {
  try {
    const { category } = req.query;
    const info = DEPARTMENT_DATA[category as string];

    if (!info) {
      return res.status(404).json({ message: "Department not found" });
    }

    // This simulates finding the files in your database
    // In a real app, you'd do: const docs = await Document.find({ category })
    // const documents = [
    //   { name: `${category} Curriculum 2024`, path: 'uploads/curriculum.pdf', createdAt: new Date() },
    //   { name: `${category} Freshman Guide`, path: 'uploads/guide.pdf', createdAt: new Date() }
    // ];

    res.json({
      info,
      // documents
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
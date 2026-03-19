// Mock data generators for testing
export const generateMockStudents = (count = 50) => {
  const firstNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Edward', 'Fiona', 'George', 'Hannah'];
  const lastNames = ['Johnson', 'Smith', 'Brown', 'Wilson', 'Taylor', 'Lee', 'Clark', 'Lewis'];
  const classes = ['10-A', '10-B', '9-A', '9-B', '8-A', '8-B'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
    rollNo: `2024${String(i + 1).padStart(3, '0')}`,
    class: classes[i % classes.length],
    email: `student${i + 1}@school.com`,
    phone: `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`,
    parentPhone: `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`,
    attendance: `${Math.floor(85 + Math.random() * 15)}%`,
    fees: Math.random() > 0.3 ? 'Paid' : 'Pending',
  }));
};

export const generateMockTeachers = (count = 20) => {
  const firstNames = ['John', 'Jane', 'Robert', 'Emily', 'Michael', 'Sarah', 'David', 'Lisa'];
  const lastNames = ['Doe', 'Smith', 'Johnson', 'Davis', 'Brown', 'Wilson', 'Lee', 'Taylor'];
  const subjects = ['Mathematics', 'Science', 'English', 'History', 'Physics', 'Chemistry', 'Biology', 'Computer Science'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
    email: `teacher${i + 1}@school.com`,
    phone: `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`,
    subject: subjects[i % subjects.length],
    qualification: ['M.Sc', 'M.A', 'Ph.D', 'B.Ed'][i % 4],
    experience: `${Math.floor(1 + Math.random() * 20)} years`,
    status: Math.random() > 0.2 ? 'Active' : 'Inactive',
  }));
};

export const generateMockAttendance = (studentCount = 30, days = 30) => {
  const statuses = ['Present', 'Absent', 'Late', 'Half Day'];
  const data = [];
  
  for (let i = 1; i <= studentCount; i++) {
    for (let d = 0; d < days; d++) {
      const date = new Date();
      date.setDate(date.getDate() - d);
      
      data.push({
        id: `${i}-${d}`,
        studentId: i,
        name: `Student ${i}`,
        rollNo: `2024${String(i).padStart(3, '0')}`,
        date: date.toISOString().split('T')[0],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        remarks: Math.random() > 0.8 ? 'Medical Leave' : '',
      });
    }
  }
  
  return data;
};

// Responsive test helper
export const isMobile = () => window.innerWidth < 768;
export const isTablet = () => window.innerWidth >= 768 && window.innerWidth < 1024;
export const isDesktop = () => window.innerWidth >= 1024;
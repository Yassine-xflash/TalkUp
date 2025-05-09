import { Post } from '@/types';

const posts: Post[] = [
  {
    id: '1',
    userId: '3', // Prof. Mohammed Alaoui
    content: "Reminder: The deadline for the Machine Learning project is next Friday. Make sure to submit your work through the platform. If you have any questions, feel free to ask in the comments or during office hours.",
    likes: ['1', '2', '5'],
    comments: [
      {
        id: '1',
        userId: '1',
        content: "Professor, could you clarify the requirements for the final report?",
        createdAt: Date.now() - 3600000,
      },
      {
        id: '2',
        userId: '3',
        content: "The report should include your methodology, results, and a discussion section. Aim for 10-15 pages including figures.",
        createdAt: Date.now() - 1800000,
      },
    ],
    createdAt: Date.now() - 86400000,
  },
  {
    id: '2',
    userId: '4', // Robotics Club
    content: "Join us this Saturday for our annual Robotics Workshop! We'll be covering the basics of Arduino programming and sensor integration. No prior experience required. Location: Lab 3, Engineering Building. Time: 10:00 AM - 2:00 PM.",
    media: ['https://images.unsplash.com/photo-1555664424-778a1e5e1b48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'],
    mediaType: 'image',
    likes: ['1', '2', '5'],
    comments: [
      {
        id: '3',
        userId: '1',
        content: "Looking forward to it! Do we need to bring our own laptops?",
        createdAt: Date.now() - 43200000,
      },
      {
        id: '4',
        userId: '4',
        content: "Yes, please bring your laptops. We'll provide the Arduino kits and components.",
        createdAt: Date.now() - 36000000,
      },
    ],
    createdAt: Date.now() - 172800000,
  },
  {
    id: '3',
    userId: '5', // Karim Tazi
    content: "Just wanted to share that I'll be giving a talk on 'Career Opportunities in Civil Engineering' next month at ENSA Fès. As a graduate, I'm excited to share my industry experience with current students. Details to follow soon!",
    likes: ['2', '3'],
    comments: [],
    createdAt: Date.now() - 259200000,
  },
  {
    id: '4',
    userId: '2', // Fatima Zahra
    content: "Has anyone taken the Renewable Energy Systems course? I'm considering it for next semester and would love to hear some feedback.",
    likes: ['3', '5'],
    comments: [
      {
        id: '5',
        userId: '5',
        content: "I took it last year. It's challenging but very interesting, especially the lab work. Professor Bennis is excellent.",
        createdAt: Date.now() - 21600000,
      },
    ],
    createdAt: Date.now() - 345600000,
  },
  {
    id: '5',
    userId: '1', // Ahmed Benali
    content: "Just finished my internship at MarocTelecom! It was an amazing experience working on their network infrastructure. If any CS students are looking for internship opportunities, I'd be happy to share some contacts.",
    media: ['https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1769&q=80'],
    mediaType: 'image',
    likes: ['2', '3', '4'],
    comments: [
      {
        id: '6',
        userId: '2',
        content: "That's great! I'm looking for an internship next summer. Could we connect?",
        createdAt: Date.now() - 10800000,
      },
      {
        id: '7',
        userId: '1',
        content: "Absolutely! Send me a message and we can discuss.",
        createdAt: Date.now() - 7200000,
      },
    ],
    createdAt: Date.now() - 432000000,
  },
];

export default posts;
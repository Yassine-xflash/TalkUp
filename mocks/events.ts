import { Event } from '@/types';

const events: Event[] = [
  {
    id: '1',
    title: 'Robotics Workshop',
    description: 'Learn the basics of Arduino programming and sensor integration. No prior experience required.',
    location: 'Lab 3, Engineering Building',
    startDate: Date.now() + 86400000 * 2, // 2 days from now
    endDate: Date.now() + 86400000 * 2 + 14400000, // 4 hours duration
    creatorId: '4', // Robotics Club
    attendees: ['1', '2'],
    image: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
    createdAt: Date.now() - 86400000 * 7,
  },
  {
    id: '2',
    title: 'Career Talk: Opportunities in Civil Engineering',
    description: 'Karim Tazi, ENSA Fès graduate and Civil Engineer at OCP Group, will share insights about career paths in Civil Engineering.',
    location: 'Auditorium, Main Building',
    startDate: Date.now() + 86400000 * 30, // 30 days from now
    endDate: Date.now() + 86400000 * 30 + 7200000, // 2 hours duration
    creatorId: '5', // Karim Tazi
    attendees: [],
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: '3',
    title: 'Machine Learning Final Project Presentations',
    description: 'Students will present their final projects for the Machine Learning course.',
    location: 'Room 201, Computer Science Building',
    startDate: Date.now() + 86400000 * 14, // 14 days from now
    endDate: Date.now() + 86400000 * 14 + 18000000, // 5 hours duration
    creatorId: '3', // Prof. Mohammed Alaoui
    attendees: ['1'],
    createdAt: Date.now() - 86400000 * 10,
  },
  {
    id: '4',
    title: 'Smart City Project Kickoff Meeting',
    description: 'Initial meeting for all students and faculty involved in the Smart City interdisciplinary project.',
    location: 'Conference Room, Administration Building',
    startDate: Date.now() + 86400000 * 5, // 5 days from now
    endDate: Date.now() + 86400000 * 5 + 7200000, // 2 hours duration
    creatorId: '3', // Prof. Mohammed Alaoui
    attendees: ['1', '2', '5'],
    image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1769&q=80',
    createdAt: Date.now() - 86400000 * 15,
  },
  {
    id: '5',
    title: 'End of Year Celebration',
    description: 'Join us to celebrate the end of the academic year with food, music, and awards ceremony.',
    location: 'Campus Garden',
    startDate: Date.now() + 86400000 * 60, // 60 days from now
    endDate: Date.now() + 86400000 * 60 + 18000000, // 5 hours duration
    creatorId: '4', // Robotics Club
    attendees: ['1', '2', '3', '5'],
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
    createdAt: Date.now() - 86400000 * 20,
  },
];

export default events;
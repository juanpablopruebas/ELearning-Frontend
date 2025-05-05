export interface Order {
  courseId: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  _id: string;
}

export interface User {
  avatar: { public_id: string; url: string };
  courses: { courseId: string }[];
  createdAt: string;
  updatedAt: string;
  email: string;
  isVerified: boolean;
  name: string;
  role: string;
  _id: string;
}

export interface QuestionData {
  _id: string;
  user: User;
  question: string;
  questionReplies: { user: User; answer: string; createdAt: string }[];
  createdAt: string;
}

export interface CourseData {
  description: string;
  links: { title: string; url: string }[];
  questions: QuestionData[];
  suggestion: string;
  videoTitle: string;
  videoLength: number;
  videoPlayer: string;
  sectionTitle: string;
  videoThumbnail: string;
  videoUrl: string;
  _id: string;
}

export interface Course {
  benefits: { title: string; _id: string }[];
  prerequisites: { title: string; _id: string }[];
  categories: string;
  createdAt: string;
  updatedAt: string;
  demoUrl: string;
  level: string;
  description: string;
  price: number;
  estimatedPrice: number;
  purchased: number;
  ratings: number;
  reviews: {
    user: User;
    rating: number;
    _id: string;
    comment: string;
    commentReplies: {
      _id: string;
      user: User;
      comment: string;
      createdAt: string;
    }[];
    createdAt: string;
  }[];
  tags: string[];
  name: string;
  thumbnail: {
    public_id: string;
    url: string;
  };
  courseData: CourseData[];
  _id: string;
}

export interface OrdersData {
  orders: Order[];
}

export interface UsersData {
  users: User[];
}

export interface CoursesData {
  courses: Course[];
}

export interface FaqData {
  _id: string;
  question: string;
  answer: string;
}

export interface CategoriesData {
  _id: string;
  title: string;
}

export interface CourseDataSingleCourse {
  description: string;
  sectionTitle: string;
  videoLength: number;
  videoTitle: string;
  _id: string;
}

export interface SingleCourse {
  benefits: { title: string; _id: string }[];
  categories: string;
  courseData: CourseDataSingleCourse[];
  createdAt: string;
  demoUrl: string;
  description: string;
  estimatedPrice: number;
  level: string;
  name: string;
  prerequisites: { title: string; _id: string }[];
  price: number;
  purchased: number;
  ratings: number;
  reviews: {
    user: { name: string };
    rating: number;
    _id: string;
    comment: string;
    createdAt: string;
  }[];
  tags: string;
  updatedAt: string;
  _id: string;
}

export interface NotificationData {
  _id: string;
  userId: string;
  message: string;
  status: string;
  title: string;
  createdAt: string;
}

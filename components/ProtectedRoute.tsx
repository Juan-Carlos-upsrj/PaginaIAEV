import React from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useCourses } from '../context/CourseContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireCourse?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireCourse = false }) => {
    const { user } = useUser();
    const { getCourse } = useCourses();
    const location = useLocation();
    const { courseId } = useParams<{ courseId: string }>();

    if (!user) {
        // Redirect to login while saving the attempted location
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requireCourse && courseId) {
        const course = getCourse(Number(courseId));
        if (!course) {
            return <Navigate to="/dashboard" replace />;
        }
    }

    return <>{children}</>;
};

export default ProtectedRoute;

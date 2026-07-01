import React from 'react';
import { Search, Plus } from 'lucide-react';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import './Courses.css';

const coursesData = [
  { id: 1, title: 'Quantum Physics - Lesson 4', category: 'Science', progress: 82, icon: '💡' },
  { id: 2, title: 'Ancient Civilizations', category: 'History', progress: 92, icon: '🏛️' },
  { id: 3, title: 'Skeletal System', category: 'Biology', progress: 92, icon: '🦴' },
  { id: 4, title: 'Calculus I', category: 'Mathematics', progress: 64, icon: '📐' },
  { id: 5, title: 'Shakespearean Works', category: 'Literature', progress: 75, icon: '📖' },
  { id: 6, title: 'Python Basics', category: 'Computer Science', progress: 70, icon: '💻' },
  { id: 7, title: 'Human Behavior', category: 'Psychology', progress: 30, icon: '🧠' }
];

export default function Courses() {
  return (
    <div className="view-container">
      <Card className="full-height-card">
        <div className="courses-header">
          <div className="tabs">
            <button className="tab active">All Courses</button>
            <button className="tab">In Progress</button>
            <button className="tab">Completed</button>
            <button className="tab">Saved</button>
          </div>
          
          <div className="courses-actions">
            <div className="search-box">
              <Search size={16} />
              <input type="text" placeholder="Search courses..." />
            </div>
            <div className="sort-box">
              <span className="sort-label">Sort by:</span>
              <select className="sort-select">
                <option>Recent</option>
                <option>Progress</option>
                <option>A-Z</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="courses-grid">
          {coursesData.map(course => (
            <div key={course.id} className="course-card">
              <div className="course-icon">{course.icon}</div>
              <p className="course-category">{course.category}:</p>
              <h4 className="course-title">{course.title}</h4>
              <ProgressBar progress={course.progress} />
              <button className="btn btn-primary w-100 mt-auto">Continue</button>
            </div>
          ))}
          
          <div className="course-card explore-card flex-center">
            <div className="explore-content">
              <div className="plus-icon flex-center">
                <Plus size={24} />
              </div>
              <h4>Explore More Courses</h4>
              <button className="btn btn-ghost">Browse</button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

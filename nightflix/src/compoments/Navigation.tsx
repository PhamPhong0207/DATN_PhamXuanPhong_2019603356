import React from 'react';
import { Link } from 'react-router-dom';
const Navigation: React.FC = () => {
 return (
   <nav className="fixed top-4 left-4 z-50">
     <Link 
       to="/" 
       className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-lg transition-colors"
     >
       Home
     </Link>
   </nav>
 );
};
export default Navigation;
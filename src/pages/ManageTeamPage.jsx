// src/pages/ManageTeamPage.jsx
import React, { useState, useEffect, useRef } from 'react'; // Import useRef
import { PlusCircle, UserPlus, XCircle, Users, Briefcase, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Team Member Pop-up Form Component
const TeamMemberModal = ({ isOpen, onClose, onSubmit, initialData = {} }) => {
    const memberData = initialData || {};

    const [name, setName] = useState(memberData.name || '');
    const [role, setRole] = useState(memberData.role || '');
    const [email, setEmail] = useState(memberData.email || '');
    // avatar will now store a Data URL for preview, or an actual URL from a backend
    const [avatar, setAvatar] = useState(memberData.avatar || '');
    const fileInputRef = useRef(null); // Ref for the hidden file input

    useEffect(() => {
        setName(memberData.name || '');
        setRole(memberData.role || '');
        setEmail(memberData.email || '');
        setAvatar(memberData.avatar || '');
    }, [memberData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Pass the member's ID if it's an edit, otherwise null for a new add
        // avatar will contain the Data URL for preview, or a persistent URL if uploaded
        onSubmit({ name, role, email, avatar }, memberData.id || null);
        onClose();
    };

    // Handler for when a file is selected
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                // Set the avatar state to the Data URL for immediate preview
                setAvatar(reader.result);
                // In a real application, you would now upload 'file' to a server
                // and store the returned permanent URL in your state instead of reader.result.
                // For this example, reader.result serves as the "uploaded" URL.
            };
            reader.readAsDataURL(file); // Read the file as a Data URL
        } else {
            setAvatar(''); // Clear avatar if no file selected
        }
    };

    // This function will programmatically click the hidden file input
    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md animate-fade-in-up transform scale-95 duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                        <UserPlus className="mr-3 text-blue-600 dark:text-blue-400" size={24} />
                        {memberData.id ? 'Edit Team Member' : 'Add New Team Member'}
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                        <XCircle size={28} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                        <input
                            type="text"
                            id="name"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                        <input
                            type="text"
                            id="role"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {/* Updated: Profile Picture Input with File Selector */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Profile Picture (Optional)</label>
                        <input
                            type="file"
                            accept="image/*" // Accept only image files
                            ref={fileInputRef} // Attach ref
                            onChange={handleFileChange}
                            className="hidden" // Hide the default file input button
                        />
                        <button
                            type="button" // Important: type="button" to prevent form submission
                            onClick={triggerFileInput} // Trigger the hidden file input
                            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                            <ImageIcon className="mr-2" size={20} />
                            Choose Profile Picture
                        </button>
                        {avatar && (
                            <div className="mt-4 text-center">
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Current Image Preview:</p>
                                <img src={avatar} alt="Profile Preview" className="mx-auto h-24 w-24 rounded-full object-cover ring-2 ring-blue-300 dark:ring-blue-600" />
                                <button
                                    type="button"
                                    onClick={() => setAvatar('')} // Clear the avatar
                                    className="mt-2 text-red-500 hover:text-red-700 text-xs"
                                >
                                    Remove Image
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md shadow-lg transition duration-200 flex items-center justify-center"
                    >
                        {memberData.id ? 'Save Changes' : 'Add Team Member'}
                        <UserPlus size={20} className="ml-2" />
                    </button>
                </form>
            </div>
        </div>
    );
};

const ManageTeamPage = ({ teamMembers, onAddOrEditMember, onDeleteMember }) => { // Receive props
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentMember, setCurrentMember] = useState(null); // For editing

    const handleEditMember = (member) => {
        setCurrentMember(member);
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to remove this team member?')) {
            onDeleteMember(id);
        }
    };

    const openAddMemberModal = () => {
        setCurrentMember(null); // Ensure currentMember is null for add mode
        setIsModalOpen(true);
    };

    return (
        <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-2xl animate-fade-in-up">
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6 border-b-4 pb-4 border-blue-600 dark:border-blue-400 flex items-center">
                <Users className="mr-4 text-blue-600 dark:text-blue-400" size={36} />
                Manage Team
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                Add, edit, or remove team members and manage their details.
            </p>

            {/* "Add New Team Member" button - Local to Manage Team Page */}
            <div className="flex justify-end mb-6">
                <button
                    onClick={openAddMemberModal}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition duration-200 flex items-center"
                >
                    <PlusCircle className="mr-2" size={20} />
                    Add New Team Member
                </button>
            </div>

            {/* Team Members List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {teamMembers.length > 0 ? (
                    teamMembers.map(member => (
                        <div key={member.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md p-6 text-center border border-gray-200 dark:border-gray-700 flex flex-col items-center">
                            <img
                                className="inline-block h-24 w-24 rounded-full ring-4 ring-blue-400 dark:ring-blue-600 object-cover mb-4 shadow-lg"
                                // Use member.avatar if available, otherwise fallback to a generic avatar based on name
                                src={member.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${member.name}&backgroundColor=008cff,00b4d8,48bfe3,64dfdf,80ffdb&backgroundType=squiggles,grid,dots&scale=90`}
                                alt={member.name}
                            />
                            <h4 className="font-bold text-xl text-gray-900 dark:text-white mb-1">{member.name}</h4>
                            <p className="text-blue-600 dark:text-blue-400 font-medium mb-2">{member.role}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{member.email}</p>
                            <div className="flex space-x-3 mt-auto">
                                <button
                                    onClick={() => handleEditMember(member)}
                                    className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors duration-200 text-sm shadow-sm"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(member.id)}
                                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200 text-sm shadow-sm"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-600 dark:text-gray-400 text-center col-span-full">No team members added yet. Click "Add New Team Member" to get started.</p>
                )}
            </div>

            {/* The modal for adding/editing team members */}
            <TeamMemberModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setCurrentMember(null); }}
                onSubmit={onAddOrEditMember} // Pass the centralized function
                initialData={currentMember || {}}
            />

            {/* Back to Dashboard Button */}
            <div className="mt-10 text-center">
                <button
                    onClick={() => navigate('/founder-dashboard')}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                    <Briefcase className="mr-2" size={20} />
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
};

export default ManageTeamPage;
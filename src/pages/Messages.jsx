// src/pages/Messages.jsx

import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import {
  MessageSquare,
  User,
  Send,
  Smile,
  Image,
  Paperclip, // For file/image upload
  XCircle, // For closing popups
  Search,
  FileText, // For generic file icon
} from 'lucide-react';

// For emoji picker
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

// For GIF picker
import { GiphyFetch } from '@giphy/js-fetch-api';
import { Grid } from '@giphy/react-components';

// --- Giphy API Setup ---
// IMPORTANT: Replace 'YOUR_GIPHY_API_KEY' with your actual Giphy API key.
// You can get one from https://developers.giphy.com/
const giphyFetch = new GiphyFetch('YOUR_GIPHY_API_KEY');
// ---------------------------------------------------

// --- Mock Data (Keep as is, or consider moving to a global state/context for real app) ---
const mockUsers = [
  { id: 'user1', name: 'Alice Smith', avatar: 'https://randomuser.me/api/portraits/women/1.jpg', status: 'online' },
  { id: 'user2', name: 'Bob Johnson', avatar: 'https://randomuser.me/api/portraits/men/2.jpg', status: 'away' },
  { id: 'user3', name: 'Charlie Brown', avatar: 'https://randomuser.me/api/portraits/men/3.jpg', status: 'online' },
  { id: 'user4', name: 'Diana Prince', avatar: 'https://randomuser.me/api/portraits/women/4.jpg', status: 'offline' },
  { id: 'user5', name: 'Eve Adams', avatar: 'https://randomuser.me/api/portraits/women/5.jpg', status: 'online' },
  { id: 'user6', name: 'Frank White', avatar: 'https://randomuser.me/api/portraits/men/6.jpg', status: 'away' },
];

const initialMockMessages = {
  'user1': [
    { id: 'msg1', sender: 'user1', text: 'Hey Arjun, how are you doing?', timestamp: '10:00 AM', type: 'text' },
    { id: 'msg2', sender: 'me', text: 'I am doing great, Alice! How about you?', timestamp: '10:01 AM', type: 'text' },
    { id: 'msg3', sender: 'user1', text: 'I am good too. Just checking in on the project.', timestamp: '10:05 AM', type: 'text' },
    { id: 'msg_gif1', sender: 'me', text: 'https://media.giphy.com/media/l0HlTLq7J9f05i1LG/giphy.gif', timestamp: '10:10 AM', type: 'gif' },
  ],
  'user2': [
    { id: 'msg4', sender: 'user2', text: 'Hi, can we discuss the investment proposal?', timestamp: 'Yesterday 3:00 PM', type: 'text' },
    { id: 'msg5', sender: 'me', text: 'Sure, Bob. When are you free?', timestamp: 'Yesterday 3:05 PM', type: 'text' },
  ],
  'user3': [
    { id: 'msg6', sender: 'user3', text: 'Hey! Got any updates?', timestamp: '2 days ago', type: 'text' },
  ],
  'user4': [
    { id: 'msg7', sender: 'user4', text: 'Just wanted to say hi!', timestamp: 'Mon 11:00 AM', type: 'text' },
    { id: 'msg8', sender: 'me', text: 'Hi Diana! Thanks for reaching out.', timestamp: 'Mon 11:05 AM', type: 'text' },
  ],
  'user5': [],
  'user6': [
    { id: 'msg9', sender: 'user6', text: 'Checking in on the PitchBridge progress.', timestamp: '9:30 AM', type: 'text' },
    { id: 'msg10', sender: 'me', text: 'It\'s going well! We just implemented a beautiful new chat interface. 😄', timestamp: '9:35 AM', type: 'text' },
  ],
};
// ---------------------------------------------------

const Messages = () => {
  const { userId } = useParams();
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [messagesData, setMessagesData] = useState(initialMockMessages);
  const [sidebarSearchTerm, setSidebarSearchTerm] = useState('');

  const [showPicker, setShowPicker] = useState(false);
  const [activePickerTab, setActivePickerTab] = useState('emoji');
  const [gifSearchTerm, setGifSearchTerm] = useState('');

  // NEW: State for attached file
  const [attachedFile, setAttachedFile] = useState(null); // { name, type, previewUrl: blob url or data url }

  const messagesEndRef = useRef(null);
  const pickerRef = useRef(null);
  const emojiButtonRef = useRef(null);
  const fileInputRef = useRef(null);

  // Effect to close picker on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target) &&
        !emojiButtonRef.current?.contains(event.target)
      ) {
        setShowPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [pickerRef, emojiButtonRef]);

  // Effect to select user from URL and scroll to bottom
  useEffect(() => {
    if (userId) {
      const userToSelect = mockUsers.find(u => u.id === userId);
      if (userToSelect) {
        setSelectedUser(userToSelect.id);
      } else {
        console.warn(`User with ID ${userId} not found.`);
        setSelectedUser(null);
      }
    } else {
      setSelectedUser(null);
    }
    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    return () => clearTimeout(timer);
  }, [userId, messagesData]);

  const handleSendMessage = () => {
    // Only send if there's text OR an attached file
    if ((newMessage.trim() || attachedFile) && selectedUser) {
      const newMsg = {
        id: `msg${Date.now()}`,
        sender: 'me',
        text: newMessage.trim(),
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        type: 'text', // Default to text
      };

      if (attachedFile) {
        // If a file is attached, modify the message details
        newMsg.type = attachedFile.type.startsWith('image/') ? 'image' : 'file'; // Use 'image' or 'file'
        newMsg.text = attachedFile.previewUrl; // For image preview
        newMsg.fileName = attachedFile.name; // Store original file name
      } else {
        newMsg.text = newMessage.trim();
        newMsg.type = 'text';
      }

      // Add actual text if available, along with attachment
      if (newMessage.trim() && attachedFile) {
        // If both text and file, you might combine them or send as two messages.
        // For simplicity, let's include the text as part of a file message, or send two separate.
        // For now, let's append text to the file message type for a combined look.
        newMsg.caption = newMessage.trim(); // Add caption for files
      }


      setMessagesData(prevMessagesData => ({
        ...prevMessagesData,
        [selectedUser]: [...(prevMessagesData[selectedUser] || []), newMsg],
      }));

      setNewMessage('');
      setAttachedFile(null); // Clear attached file after sending
      setShowPicker(false);
    }
  };

  const handleEmojiSelect = (emoji) => {
    setNewMessage(prevMsg => prevMsg + emoji.native);
  };

  const handleGifSelect = (gif) => {
    if (selectedUser) {
      const newMsg = {
        id: `msg${Date.now()}`,
        sender: 'me',
        text: gif.images.original.url,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        type: 'gif',
      };

      setMessagesData(prevMessagesData => ({
        ...prevMessagesData,
        [selectedUser]: [...(prevMessagesData[selectedUser] || []), newMsg],
      }));
      setShowPicker(false);
      setGifSearchTerm('');
    }
  };

  const fetchGifs = (offset) => {
    if (!gifSearchTerm) {
      return giphyFetch.trending({ offset, limit: 10 });
    }
    return giphyFetch.search(gifSearchTerm, { offset, limit: 10 });
  };

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(sidebarSearchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const handleAttachButtonClick = () => {
    fileInputRef.current?.click();
    setShowPicker(false);
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        let previewUrl = reader.result;
        // For non-image/video files, you might not need a data URL preview
        // or you could generate a generic icon here.
        // For now, we'll keep the data URL for simplicity, but it's not always efficient.
        // For real files, you'd typically upload them and get a URL.

        setAttachedFile({
          file: file, // Store the actual File object for later upload
          name: file.name,
          type: file.type,
          previewUrl: previewUrl // Data URL for immediate preview
        });
      };

      // Read as Data URL for preview purposes (especially for images)
      // For very large files, consider creating an Object URL (URL.createObjectURL)
      // which is more memory efficient, but requires revoking.
      reader.readAsDataURL(file);
    }
    // Clear the input value so the same file can be selected again
    event.target.value = null;
  };

  const handleRemoveAttachment = () => {
    setAttachedFile(null);
  };


  return (
    // Main Container with Soft Radial Gradient Background
    <div >
      {/* Container for the chat box itself */}
      <div className="flex flex-1 rounded-2xl shadow-inset-xl overflow-hidden bg-white dark:bg-[#374151] border border-gray-100 dark:border-gray-800 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">

        {/* Left Sidebar: List of People */}
        <div className="w-80 border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-850 flex flex-col shadow-inner">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-blue-600 to-purple-700 dark:from-blue-900 dark:to-purple-950 text-white flex items-center justify-between shadow-md">
            <h2 className="text-xl font-extrabold flex items-center tracking-wide">
              <MessageSquare className="mr-3 text-blue-200" size={24} />
              My Connections
            </h2>
          </div>
          {/* Search Input in Sidebar */}
          <div className="p-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <div className="relative">
              <input
                type="text"
                placeholder="Find contacts..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all duration-200"
                value={sidebarSearchTerm}
                onChange={(e) => setSidebarSearchTerm(e.target.value)}
              />
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar pt-2 pb-4 dark:bg-[#374151] ">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <Link
                  key={user.id}
                  to={`/messages/${user.id}`} 
                  className={`flex items-center p-3 mx-2 my-1 cursor-pointer relative transition-all duration-200 ease-in-out rounded-lg
                    ${selectedUser === user.id
                      ? 'bg-blue-50 dark:bg-blue-900/40 border-l-4 border-blue-600 dark:border-blue-400 text-blue-800 dark:text-blue-200 font-semibold shadow-inner-sm'
                      : 'hover:bg-gray-300 dark:hover:bg-gray-800 text-gray-800 dark:text-white'
                    }`}
                >
                  <div className="relative">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full mr-4 object-cover ring-2 ring-blue-400 dark:ring-blue-600" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center mr-4 text-gray-500 dark:text-gray-400 ring-2 ring-blue-400 dark:ring-blue-600">
                        <User size={24} />
                      </div>
                    )}
                    {/* Online/Offline Status Dot */}
                    <span className={`absolute bottom-0 right-3 w-3 h-3 rounded-full ${getStatusColor(user.status)} ring-2 ring-white dark:ring-gray-850`}></span>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <span className="block text-lg truncate">{user.name}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {messagesData[user.id]?.length > 0 ? messagesData[user.id].slice(-1)[0].text.substring(0, 30) + '...' : 'No messages yet'}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <p className="p-4 text-gray-500 dark:text-gray-400 text-center">No matching connections found.</p>
            )}
          </div>
        </div>

        {/* Right Content: Chat Area */}
        {selectedUser ? (
          <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900 relative">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-between shadow-md z-10">
              <div className="flex items-center">
                {mockUsers.find(u => u.id === selectedUser)?.avatar ? (
                  <img
                    src={mockUsers.find(u => u.id === selectedUser).avatar}
                    alt={mockUsers.find(u => u.id === selectedUser).name}
                    className="w-12 h-12 rounded-full mr-4 object-cover ring-2 ring-blue-500 dark:ring-blue-700"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center mr-4 text-gray-500 dark:text-gray-400 ring-2 ring-blue-500 dark:ring-blue-700">
                    <User size={24} />
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-xl text-gray-900 dark:text-white">
                    {mockUsers.find(u => u.id === selectedUser)?.name}
                  </h3>
                  <span className={`text-sm flex items-center ${getStatusColor(mockUsers.find(u => u.id === selectedUser)?.status)} text-white px-2 py-0.5 rounded-full mt-1 inline-block`}>
                    <span className={`w-2 h-2 rounded-full mr-1 ${getStatusColor(mockUsers.find(u => u.id === selectedUser)?.status)}`}></span>
                    {mockUsers.find(u => u.id === selectedUser)?.status.charAt(0).toUpperCase() + mockUsers.find(u => u.id === selectedUser)?.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Messages Display - UPDATED BACKGROUND */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar
                          bg-[radial-gradient(at_top_left,_#fefce8_0%,_transparent_50%),_radial-gradient(at_top_right,_#fff7ed_0%,_transparent_50%)] dark:bg-[radial-gradient(at_top_left,_rgba(25,30,40,0.8)_0%,_transparent_50%),_radial-gradient(at_top_right,_rgba(25,30,40,0.8)_0%,_transparent_50%)]">
              {messagesData[selectedUser] && messagesData[selectedUser].length > 0 ? (
                messagesData[selectedUser].map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === 'me' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-lg relative group transition-transform duration-200 ease-out transform hover:scale-[1.01]
                        ${message.sender === 'me'
                          ? 'bg-gradient-to-br from-blue-600 to-purple-700 text-white rounded-br-none'
                          : 'bg-gradient-to-br from-gray-200 to-gray-300 text-gray-900 dark:from-gray-700 dark:to-gray-750 dark:text-white rounded-tl-none'
                        }`}
                    >
                      {message.type === 'text' && (
                        <p className="text-sm break-words">{message.text}</p>
                      )}
                      {message.type === 'gif' && (
                        <img src={message.text} alt="GIF" className="max-w-full rounded-lg animate-fade-in" />
                      )}
                      {/* NEW: Render attached images or files */}
                      {(message.type === 'image' || message.type === 'file') && (
                        <div className="flex flex-col items-center p-2 rounded-lg bg-gray-100 dark:bg-gray-700 mb-2">
                          {message.type === 'image' && (
                            <img src={message.text} alt="Uploaded" className="max-w-full rounded-md max-h-48 object-contain mb-2 animate-fade-in" />
                          )}
                          {message.type === 'file' && (
                            <div className="flex items-center text-gray-700 dark:text-gray-300">
                              <FileText size={24} className="mr-2 text-blue-500 dark:text-blue-400" />
                              <span className="text-sm font-medium break-all">{message.fileName}</span>
                            </div>
                          )}
                          {message.caption && <p className="text-sm break-words mt-1">{message.caption}</p>}
                        </div>
                      )}
                      <span className={`text-xs mt-1 block text-right opacity-70 group-hover:opacity-100 transition-opacity
                        ${message.sender === 'me' ? 'text-blue-100 dark:text-purple-200' : 'text-gray-600 dark:text-gray-400'}`}>
                        {message.timestamp}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  <MessageSquare size={64} className="mb-4 text-blue-400 animate-bounce-slow" />
                  <p className="text-xl font-semibold mb-2">No messages yet</p>
                  <p className="text-center max-w-sm">Say hello and start a wonderful conversation with {mockUsers.find(u => u.id === selectedUser)?.name}!</p>
                </div>
              )}
              <div ref={messagesEndRef} /> {/* Scroll target */}
            </div>

            {/* Message Input Area */}
            <div className="relative p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col shadow-lg z-20">
              {/* Combined Emoji/GIF Picker */}
              {showPicker && (
                <div
                  ref={pickerRef}
                  className="absolute bottom-full right-4 left-4 mb-2 z-30 transform translate-y-[-10px] animate-fade-in-up
                             bg-white dark:bg-gray-850 rounded-lg shadow-xl overflow-hidden flex flex-col"
                >
                  <div className="flex border-b border-gray-200 dark:border-gray-700">
                    <button
                      className={`flex-1 p-3 text-center font-medium ${activePickerTab === 'emoji' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                      onClick={() => setActivePickerTab('emoji')}
                    >
                      Emojis
                    </button>
                    <button
                      className={`flex-1 p-3 text-center font-medium ${activePickerTab === 'gif' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                      onClick={() => setActivePickerTab('gif')}
                    >
                      GIFs
                    </button>
                    <button
                      onClick={() => setShowPicker(false)}
                      className="p-3 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                      title="Close"
                    >
                      <XCircle size={24} />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {activePickerTab === 'emoji' && (
                      <Picker data={data} onEmojiSelect={handleEmojiSelect} theme="auto" />
                    )}
                    {activePickerTab === 'gif' && (
                      <div className="p-4">
                        <div className="flex items-center mb-3">
                          <input
                            type="text"
                            placeholder="Search GIFs..."
                            className="flex-1 p-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            value={gifSearchTerm}
                            onChange={(e) => setGifSearchTerm(e.target.value)}
                          />
                        </div>
                        <Grid
                          key={gifSearchTerm}
                          width={400}
                          columns={3}
                          fetchGifs={fetchGifs}
                          onGifClick={handleGifSelect}
                          noLink={true}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* NEW: Attached file preview area */}
              {attachedFile && (
                <div className="relative p-3 mb-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 flex items-center justify-between animate-fade-in-up">
                  <div className="flex items-center flex-1 overflow-hidden">
                    {attachedFile.type.startsWith('image/') ? (
                      <img src={attachedFile.previewUrl} alt="Preview" className="w-16 h-16 object-contain rounded-md mr-3 shadow-sm" />
                    ) : (
                      <FileText size={40} className="text-blue-500 dark:text-blue-400 mr-3 flex-shrink-0" />
                    )}
                    <span className="text-sm font-medium text-gray-800 dark:text-white truncate">
                      {attachedFile.name}
                    </span>
                  </div>
                  <button
                    onClick={handleRemoveAttachment}
                    className="ml-4 p-1 rounded-full bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
                    title="Remove attachment"
                  >
                    <XCircle size={20} />
                  </button>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    // Only send if there's new message text OR an attached file
                    if (e.key === 'Enter' && (newMessage.trim() || attachedFile)) {
                      handleSendMessage();
                    }
                  }}
                  placeholder={attachedFile ? "Add a caption..." : "Type your message here..."}
                  className="flex-1 p-3 rounded-xl border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white transition-all duration-200 text-base"
                />
                <button
                  ref={emojiButtonRef}
                  onClick={() => {
                    setShowPicker(prev => !prev);
                    setActivePickerTab('emoji');
                  }}
                  className="p-3 bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-100 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 transform hover:scale-110 active:scale-95 shadow-md"
                  title="Add Emoji / GIF"
                >
                  <Smile size={22} />
                </button>

                {/* Hidden file input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  accept="image/*,video/*,application/pdf,.doc,.docx,.xls,.xlsx,.txt"
                  multiple // Keep multiple for now, though we only handle first file for simplicity
                />

                {/* Button to trigger file input */}
                <button
                  onClick={handleAttachButtonClick}
                  className="p-3 bg-purple-50 dark:bg-gray-700 text-purple-600 dark:text-purple-400 rounded-full hover:bg-purple-100 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 transform hover:scale-110 active:scale-95 shadow-md"
                  title="Attach File"
                >
                  <Paperclip size={22} />
                </button>

                <button
                  onClick={handleSendMessage}
                  className="p-3 bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-full hover:from-blue-700 hover:to-purple-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 shadow-lg"
                  title="Send Message"
                  // Disable send button if no message text AND no attached file
                  disabled={!newMessage.trim() && !attachedFile}
                >
                  <Send size={22} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 p-4 bg-gray-100 dark:bg-gray-900">
            <MessageSquare size={80} className="mb-6 text-blue-400 animate-bounce-slow" />
            <p className="text-3xl font-extrabold mb-3 text-gray-800 dark:text-white">Begin a Stellar Conversation</p>
            <p className="text-lg text-center max-w-md">Select a contact from the left panel to dive into their messages or initiate a brand new chat experience!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
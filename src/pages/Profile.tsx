import React from 'react';
import { useApp } from '@/context/AppContext';
import { Globe, MapPin, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Profile = () => {
  const { user } = useApp();

  const interests = [
    { icon: <Globe size={16} />, label: 'Travel' },
    { icon: <Globe size={16} />, label: 'Technology' },
    { icon: <Globe size={16} />, label: 'Fitness' },
  ];

  return (
    <div className="min-h-screen pb-24">
      {/* Banner and Avatar */}
      <div className="relative h-48 bg-gradient-to-b from-blue-500 to-purple-600">
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
          <div className="w-24 h-24 rounded-full border-4 border-black bg-gray-300">
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gray-600 flex items-center justify-center">
                <span className="text-2xl text-white">
                  {user?.email?.[0].toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="mt-16 px-6 text-center">
        <h1 className="text-xl font-semibold text-white">
          {user?.user_metadata?.full_name || 'Anonymous User'}
        </h1>
        <p className="text-white/60 mt-1">Digital Explorer</p>

        {/* Location and Languages */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <div className="flex items-center gap-1 text-white/60">
            <MapPin size={16} />
            <span className="text-sm">New York, USA</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs">
              EN
            </span>
            <span className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs">
              ES
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <Button variant="default" className="px-6">
            Message
          </Button>
          <Button variant="outline" size="icon">
            <Instagram size={18} />
          </Button>
        </div>

        {/* Interests */}
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {interests.map((interest, index) => (
            <div
              key={index}
              className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full"
            >
              {interest.icon}
              <span className="text-sm text-white/80">{interest.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;

'use client';

import {
  AlertTriangle,
  Check,
  CheckCircle,
  Clock,
  Sparkles,
  X,
} from 'lucide-react';

const stats = [
  { title: 'New Requests', value: '4', description: 'Pending your review' },
  { title: 'Scheduled', value: '3', description: 'Upcoming appointments' },
  { title: 'Waitlisted', value: '6', description: 'Awaiting open slots' },
];

const requests = [
  {
    studentId: '#2345',
    university: 'Stanford University',
    time: 'about 2 hours ago',
    priority: 'High',
  },
  {
    studentId: '#6789',
    university: 'University of California, Berkeley',
    time: 'about 5 hours ago',
    priority: 'Medium',
  },
  {
    studentId: '#1122',
    university: 'Massachusetts Institute of Technology',
    time: '1 day ago',
    priority: 'Low',
  },
  {
    studentId: '#3344',
    university: 'New York University',
    time: '2 days ago',
    priority: 'High',
  },
];

const priorityStyles = {
  High: 'bg-red-100 text-red-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Low: 'bg-gray-100 text-gray-700',
};

export default function ExternalCounsellorDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map(stat => (
          <div key={stat.title} className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">{stat.title}</p>
            <p className="mt-1 text-3xl font-bold text-gray-800">
              {stat.value}
            </p>
            <p className="mt-1 text-sm text-gray-500">{stat.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-gray-800">
            Incoming Requests
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
            {requests.map(request => (
              <div
                key={request.studentId}
                className="rounded-xl bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold text-gray-800">
                      Student {request.studentId}
                    </p>
                    <p className="text-sm text-gray-500">{request.university}</p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      priorityStyles[
                        request.priority as keyof typeof priorityStyles
                      ]
                    }`}
                  >
                    {request.priority}
                  </span>
                </div>
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>Requested {request.time}</span>
                </div>
                <div className="mt-5 grid grid-cols-3 gap-2 text-sm">
                  <button className="flex items-center justify-center gap-2 rounded-lg bg-gray-100 py-2 font-medium text-gray-600 hover:bg-gray-200">
                    <X className="h-4 w-4" />
                    Reject
                  </button>
                  <button className="flex items-center justify-center gap-2 rounded-lg bg-green-100 py-2 font-medium text-green-700 hover:bg-green-200">
                    <Clock className="h-4 w-4" />
                    Waitlist
                  </button>
                  <button className="flex items-center justify-center gap-2 rounded-lg bg-blue-500 py-2 font-medium text-white hover:bg-blue-600">
                    <Check className="h-4 w-4" />
                    Accept
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800">Assistant</h2>
          <div className="mt-4 rounded-xl bg-blue-100/60 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-blue-800">
                Adaptive Scheduling Assistant
              </p>
              <Sparkles className="h-5 w-5 text-blue-500" />
            </div>
            <div className="mt-3 text-sm text-blue-900/80">
              <p className="font-semibold">Recommendation:</p>
              <p>
                Based on the <span className="font-bold">high urgency</span> and
                your open slot this afternoon, it is recommended to{' '}
                <span className="font-bold">
                  accept the request from Stanford University
                </span>
                .
              </p>
            </div>
            <div className="mt-5 flex items-center gap-3">
              <button className="flex-1 rounded-lg bg-blue-500 py-2 text-sm font-medium text-white hover:bg-blue-600">
                Accept Recommendation
              </button>
              <button className="rounded-lg px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200/50">
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

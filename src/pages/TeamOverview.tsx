import { useState } from 'react';
import { useStore } from '../store';
import { Member } from '../types';
import MemberCard from '../components/MemberCard';
import Modal from '../components/Modal';

export default function TeamOverview() {
  const members = useStore((state) => state.members);
  const addMember = useStore((state) => state.addMember);
  const updateMember = useStore((state) => state.updateMember);
  const deleteMember = useStore((state) => state.deleteMember);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [editMemberName, setEditMemberName] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'capacity'>('name');

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMemberName.trim()) {
      addMember(newMemberName.trim());
      setNewMemberName('');
      setIsAddModalOpen(false);
    }
  };

  const handleEditMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMember && editMemberName.trim()) {
      updateMember(editingMember.id, { name: editMemberName.trim() });
      setIsEditModalOpen(false);
      setEditingMember(null);
    }
  };

  const openEditModal = (member: Member) => {
    setEditingMember(member);
    setEditMemberName(member.name);
    setIsEditModalOpen(true);
  };

  const handleDeleteMember = (id: string) => {
    if (confirm('Are you sure you want to delete this team member? Their tasks will be unassigned.')) {
      deleteMember(id);
    }
  };

  const sortedMembers = [...members].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else {
      const capacityA = useStore.getState().getMemberCapacity(a.id);
      const capacityB = useStore.getState().getMemberCapacity(b.id);
      return capacityB - capacityA;
    }
  });

  const totalTasks = members.reduce((sum, member) => {
    return sum + useStore.getState().getMemberTaskCount(member.id);
  }, 0);

  const overloadedMembers = members.filter((member) => {
    return useStore.getState().getMemberCapacity(member.id) > 80;
  }).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Team Overview</h1>
            <p className="text-gray-600 mt-1">{members.length} team members · {totalTasks} active tasks</p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Member
          </button>
        </div>

        {overloadedMembers > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-red-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-red-800">Capacity Alert</h3>
                <p className="text-sm text-red-700 mt-1">
                  {overloadedMembers} team {overloadedMembers === 1 ? 'member is' : 'members are'} overloaded (&gt;80% capacity)
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'capacity')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="name">Sort by Name</option>
            <option value="capacity">Sort by Capacity</option>
          </select>
        </div>
      </div>

      {members.length === 0 ? (
        <div className="text-center py-16">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No team members</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding a team member.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedMembers.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              onEdit={openEditModal}
              onDelete={handleDeleteMember}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Team Member"
      >
        <form onSubmit={handleAddMember}>
          <div className="mb-4">
            <label htmlFor="member-name" className="block text-sm font-medium text-gray-700 mb-2">
              Member Name
            </label>
            <input
              id="member-name"
              type="text"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter member name"
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
            >
              Add Member
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Team Member"
      >
        <form onSubmit={handleEditMember}>
          <div className="mb-4">
            <label htmlFor="edit-member-name" className="block text-sm font-medium text-gray-700 mb-2">
              Member Name
            </label>
            <input
              id="edit-member-name"
              type="text"
              value={editMemberName}
              onChange={(e) => setEditMemberName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

import { UserPlus, ChevronDown } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

export const InviteForm = () => (
  <Card className="p-8">
    <h3 className="text-lg font-display font-bold text-white mb-6 flex items-center gap-3">
      <UserPlus className="w-5 h-5 text-emerald-500" /> Invite Member
    </h3>
    <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
      <div>
        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Email Address</label>
        <input type="email" placeholder="user@company.com" className="glass-input w-full p-3 text-sm font-medium" />
      </div>
      <div>
        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Role</label>
        <div className="relative">
          <select className="glass-input w-full p-3 text-sm font-medium appearance-none cursor-pointer">
            <option value="viewer">Viewer</option>
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </select>
          <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-zinc-500 pointer-events-none" />
        </div>
      </div>
      <div>
        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Message (Optional)</label>
        <textarea rows={2} placeholder="Add a note..." className="glass-input w-full p-3 text-sm font-medium resize-none" />
      </div>
      <Button type="submit" className="w-full justify-center mt-2">
        Send Invite
      </Button>
    </form>
  </Card>
);

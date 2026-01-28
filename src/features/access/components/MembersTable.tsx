import { Trash2, ChevronDown, Search, Users } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Table, THead, TBody, TH, TD } from '../../../components/ui/Table';
import type { Member, Role } from '../../../types';

interface Props {
  members: Member[];
  roles: Role[];
}

export const MembersTable = ({ members, roles }: Props) => (
  <Card className="flex flex-col">
    <div className="p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <h3 className="text-lg font-display font-bold text-white flex items-center gap-3">
        <Users className="w-5 h-5 text-zinc-500" />
        Current Members <span className="text-zinc-500 text-sm ml-1 font-mono">({members.length})</span>
      </h3>
      <div className="relative w-full md:w-64">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-600" />
        <input type="text" placeholder="Search members..." className="glass-input w-full pl-9 pr-4 py-2 text-sm placeholder-zinc-600" />
      </div>
    </div>
    <div className="flex-1 overflow-auto">
      <Table>
        <THead>
          <tr>
            <TH className="px-8 py-4">User</TH>
            <TH className="px-8 py-4">Role</TH>
            <TH className="px-8 py-4">Added</TH>
            <TH className="px-8 py-4 text-right">Action</TH>
          </tr>
        </THead>
        <TBody>
          {members.map((member) => (
            <tr key={member.id} className="group hover:bg-white/[0.02] transition-colors">
              <TD className="px-8 py-4">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${member.accent ?? 'bg-zinc-800 text-zinc-300 border border-white/10'}`}>
                    {member.initials}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{member.name}</div>
                    <div className="text-xs text-zinc-500">{member.email}</div>
                  </div>
                </div>
              </TD>
              <TD className="px-8 py-4">
                <div className="relative inline-block">
                  <select
                    defaultValue={member.role}
                    className="appearance-none bg-transparent text-zinc-300 text-xs font-bold uppercase border border-white/10 rounded px-2 py-1 pr-6 cursor-pointer hover:border-white/30 transition-colors focus:outline-none focus:border-emerald-500"
                  >
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-1 top-1.5 w-3 h-3 text-zinc-600 pointer-events-none" />
                </div>
              </TD>
              <TD className="px-8 py-4 text-xs text-zinc-500 font-mono">{member.added}</TD>
              <TD className="px-8 py-4 text-right">
                {member.role === 'owner' ? (
                  <span className="text-zinc-600 text-xs italic">Primary</span>
                ) : (
                  <button className="p-2 hover:bg-red-500/10 rounded-lg text-zinc-600 hover:text-red-400 transition-colors" title="Remove User">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </TD>
            </tr>
          ))}
        </TBody>
      </Table>
    </div>
  </Card>
);

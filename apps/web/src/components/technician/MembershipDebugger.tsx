/**
 * Componente de testing para verificar datos de membresía
 * Solo para desarrollo - eliminar en producción
 */

import { useAuth } from "@/context/AuthContext";
import { UserTechnician } from "@/types";

const MembershipDebugger = () => {
    const { user } = useAuth();
    const technician = user as UserTechnician;

    if (import.meta.env.PROD) {
        return null; // No mostrar en producción
    }

    if (!technician?.technician) {
        return (
            <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg max-w-sm z-50">
                <p className="font-bold">⚠️ Debug: No hay datos de técnico</p>
            </div>
        );
    }

    const membershipData = {
        type: technician.technician.membershipType || 'undefined',
        active: technician.technician.membershipActive || false,
        expires: technician.technician.membershipExpiresAt || 'undefined'
    };

    return (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-lg max-w-md z-50 text-xs font-mono">
            <div className="flex items-center justify-between mb-2">
                <p className="font-bold text-sm">🔍 Membership Debug</p>
                <span className="text-green-400">●</span>
            </div>
            <div className="space-y-1">
                <div className="flex gap-2">
                    <span className="text-gray-400">Type:</span>
                    <span className="text-cyan-300">{membershipData.type}</span>
                </div>
                <div className="flex gap-2">
                    <span className="text-gray-400">Active:</span>
                    <span className={membershipData.active ? "text-green-400" : "text-red-400"}>
                        {membershipData.active ? "✓ true" : "✗ false"}
                    </span>
                </div>
                <div className="flex gap-2">
                    <span className="text-gray-400">Expires:</span>
                    <span className="text-yellow-300 break-all">
                        {membershipData.expires}
                    </span>
                </div>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-700">
                <p className="text-gray-400 text-[10px]">
                    Este panel solo aparece en desarrollo
                </p>
            </div>
        </div>
    );
};

export default MembershipDebugger;

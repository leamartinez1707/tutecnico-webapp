import { getPasswordStrength } from "@/lib/utils";

const PasswordStrength = ({ passwordSelected }: { passwordSelected: string }) => {
    if (!passwordSelected || passwordSelected.length === 0) {
        return null;
    }
    const passwordStrength = getPasswordStrength(passwordSelected);
    return (
        <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700/50">
            <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-zinc-300 font-medium">Fortaleza de contraseña:</span>
                <span className={`font-semibold ${passwordStrength.strength >= 3
                    ? 'text-emerald-400'
                    : passwordStrength.strength >= 2
                        ? 'text-yellow-400'
                        : 'text-red-400'
                    }`}>
                    {passwordStrength.text}
                </span>
            </div>
            <div className="w-full bg-zinc-700/50 rounded-full h-2 overflow-hidden">
                <div
                    className={`h-full transition-all duration-300 ${passwordStrength.strength >= 3
                        ? 'bg-emerald-500'
                        : passwordStrength.strength >= 2
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                    style={{ width: `${(passwordStrength.strength / 4) * 100}%` }}
                />
            </div>
        </div>
    )
}

export default PasswordStrength
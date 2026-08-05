import { Button } from '@/components/ui/button'
import DashboardCard from '@/components/user/card/DashboardCard'
import { X } from 'lucide-react'
import { Technicians } from '@/types'

type MobileTechInfoProps = {
    selectedTechnician: (Technicians & {
        distance?: number;
    })
    setSelectedTechnician: React.Dispatch<React.SetStateAction<(Technicians & {
        distance?: number;
    }) | null>>
    setAddBookingModal: React.Dispatch<React.SetStateAction<boolean>>
}

const MobileTechInfo = ({ selectedTechnician, setSelectedTechnician, setAddBookingModal }: MobileTechInfoProps) => {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-100 p-4 shadow-lg rounded-t-xl z-50 md:w-1/3 md:right-10 md:left-auto">
            <div className='flex justify-end'><Button variant="ghost" size="sm" onClick={() => setSelectedTechnician(null)}>
                <X className="h-4 w-4" />
            </Button></div>
            <DashboardCard
                tech={selectedTechnician}
                setAddBookingModal={setAddBookingModal}
            />
        </div>
    )
}

export default MobileTechInfo
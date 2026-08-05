import { Dispatch } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ContactFormData, LoggedUser, PersonalFormData } from "@/types"
import UserPersonalData from "./UserPersonalData"
import UserContactData from "./UserContactData"
import UserSecurityData from "./UserSecurityData"

export interface UserDataProps {
    isEditingPersonal: boolean;
    isEditingContact: boolean;
    user: LoggedUser | null;
    editedPersonal: PersonalFormData;
    editedContact: ContactFormData;
    setIsEditingContact: Dispatch<React.SetStateAction<boolean>>
    setIsEditingPersonal: Dispatch<React.SetStateAction<boolean>>;
    setEditedPersonal: Dispatch<React.SetStateAction<PersonalFormData>>;
    setEditedContact: Dispatch<React.SetStateAction<ContactFormData>>;
    handleSaveContact: () => Promise<void>;
    handleSavePersonal: () => Promise<void>;
}

const UserData = ({ 
    isEditingPersonal, 
    isEditingContact, 
    user, 
    editedPersonal, 
    setIsEditingContact, 
    setIsEditingPersonal, 
    setEditedPersonal, 
    setEditedContact, 
    handleSaveContact, 
    handleSavePersonal, 
    editedContact
}: UserDataProps) => {
    return (
        <div className="space-y-6">
            {/* Información Personal */}
            <Card className="shadow-sm border border-gray-200">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        Información Personal
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <UserPersonalData
                        isEditingPersonal={isEditingPersonal}
                        user={user}
                        editedPersonal={editedPersonal}
                        setIsEditingPersonal={setIsEditingPersonal}
                        setEditedPersonal={setEditedPersonal}
                        handleSavePersonal={handleSavePersonal}
                    />
                    
                </CardContent>
            </Card>

            {/* Información de Contacto */}
            <Card className="shadow-sm border border-gray-200">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        Información de Contacto
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <UserContactData
                        isEditingContact={isEditingContact}
                        user={user}
                        editedContact={editedContact}
                        setIsEditingContact={setIsEditingContact}
                        setEditedContact={setEditedContact}
                        handleSaveContact={handleSaveContact}
                    />
                </CardContent>
            </Card>

            {/* Seguridad */}
            <Card className="shadow-sm border border-gray-200">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        Seguridad de la Cuenta
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <UserSecurityData />
                </CardContent>
            </Card>
        </div>
    )
}

export default UserData
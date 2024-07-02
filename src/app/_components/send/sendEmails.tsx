'use client'

import { useState } from "react";
import { toast } from "react-toastify";
import { sendEmail } from "~/utils/sendEmail"
interface Contact {
    id: number;
    name: string;
    email: string;
    address: string | null;
    phoneNumber: number | null;
    createdAt: Date;
    updatedAt: Date;
    emailListId: number | null;
}

interface List {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    contacts: Contact[];
}

type Props = {
    lists: List[];
    serviceId: string;
    templateId: string;
    publicKey: string;
}

interface IenvData {
    serviceId: string,
    templateId: string,
    publicKey: string,
}

export default function SendEmails({ lists, serviceId, templateId, publicKey }: Props) {
    const [select, setSelect] = useState<number | null | undefined>(null)
    const [status, setStatus] = useState<boolean>(false);
    const envData: IenvData = {
        serviceId,
        templateId,
        publicKey,
    }

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = Number(e.target.value);
        setSelect(selectedId);
    }

    const handleSendEmail = () => {
        if (select == null) {
            return toast.warn('Select a list before sending')
        }
        const userConfirm = window.confirm('Are you sure you want to send the emails? This cannot be reversed')
        if (userConfirm) {
            setStatus(true)
            const filterdList = lists.filter((list) => list.id == select)
            filterdList[0]?.contacts.forEach(async (item) => {
                await sendEmail(item.email, { ...envData });
                await new Promise(resolve => setTimeout(resolve, 3000));
            })
            setStatus(false)
        }
        else {
            return
        }

    }

    return (
        <div className="container flex flex-col items-center justify-center gap-11 px-4 py-16 ">
            <div>
                <h1 className='text-5xl font-extrabold dark:text-white text-center py-1'>Choose list</h1>
                <select className="select select-primary w-full max-w-xs" onChange={handleChange}>
                    <option value={undefined}></option>
                    {lists && lists.map((list) => {
                        return (
                            <option key={list.id} value={list.id}>{list.name}</option>
                        )
                    })}
                </select>
            </div>
            <div>
                <button onClick={handleSendEmail} className="btn btn-wide bg-primary">SEND</button>
            </div>
            {status == true ? <span className="loading loading-ring loading-lg"></span> : <></>}
        </div>
    )
}


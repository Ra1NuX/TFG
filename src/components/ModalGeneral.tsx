
import { Dialog, Transition } from '@headlessui/react'
import React, { Fragment, useState } from 'react'

interface ModalProps  {
className?: string
title?: React.ReactNode
description?: React.ReactNode
buttonText?: React.ReactNode
children: React.ReactNode
}

export default function Modal({ className="", buttonText="Open Dialog", title, description, children }:ModalProps) {
    let [isOpen, setIsOpen] = useState(false)

    function closeModal() {
        setIsOpen(false)
    }

    function openModal() {
        setIsOpen(true)
    }

    return (
        <>
            <button
                type="button"
                onClick={openModal}
                className={className}
            >
                {buttonText}
            </button>

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-[1010]" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    {title && <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        {title}
                                    </Dialog.Title>}
                                    {description && <Dialog.Description>
                                        {description}
                                    </Dialog.Description>}

                                    {children}

                                    <button className='absolute top-2 right-2 bg-red-600 w-5 h-5 rounded text-white flex justify-center items-center' onClick={() => closeModal()}>✕</button>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}
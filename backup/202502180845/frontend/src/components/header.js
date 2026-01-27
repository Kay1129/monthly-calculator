'use client'

import { useState } from 'react'
import { Link } from 'react-router-dom';
import { Bars3Icon } from '@heroicons/react/20/solid';

const navigation = [
    { name: 'Dashboard', link:"/dashboard"},
    { name: 'Register Entry', link:"/registerForm" },
    { name: 'Expense Detail', link:"/expenseDetail" },
    { name: 'Annual Summary', link:"/annualSummary" },
]

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <>
            <header className="absolute inset-x-0 top-0 z-50 flex h-16 border-b border-gray-900/10 bg-neutral-700">
                <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-1 items-center gap-x-6">
                        <button type="button" onClick={() => setMobileMenuOpen(true)} className="-m-3 p-3 md:hidden">
                            <span className="sr-only">Open main menu</span>
                            <Bars3Icon aria-hidden="true" className="size-5 text-gray-900" />
                        </button>
                        <Link className="h-8 w-auto text-white font-bold" to='/'>
                            OG GANG
                        </Link>
                    </div>
                    <nav className="hidden md:flex md:gap-x-11 md:text-sm/6 md:font-semibold md:text-white ">
                        {navigation.map((item, itemIdx) => (
                            <Link key={itemIdx} to={item.link} className='hover:font-extrabold hover:shadow-sm'>
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                    <div className="flex flex-1 items-center justify-end gap-x-8">
                    </div>
                </div>
            </header>
        </>
    )
}

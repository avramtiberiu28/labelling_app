//navbar.jsx
import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon, UserIcon } from '@heroicons/react/24/outline'
import {useAuth} from '../../../auth/components/AuthContext'
import {useState} from 'react'
import ModalAdd from '../modalAdd/modalAdd'

const navigation = [
    { name: 'Dashboard', href: '#', current: true },
    { name: 'Adauga eticheta', href: '#', current: false},
    //{ name: 'Projects', href: '#', current: false },
    //{ name: 'Calendar', href: '#', current: false },
  ]
  
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

export default function Meniu ({onRefresh}) {
  const { logout, isLoggedIn } = useAuth(); // Folosirea hook-ului de autentificare
  const [isModalAddOpen, setIsModalAddOpen] = useState(false); // Stare pentru deschiderea modalei de adăugare
  const [refresh, setRefresh] = useState(false);

  const handleLogout = () => {
    logout();
  }
    return (
      <>
      <Disclosure as="nav" className="bg-custom absolute top-0 left-0 right-0">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
              <div className="relative flex h-16 items-center justify-between">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  {/* Mobile menu button*/}
                  <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-green-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                  <div className="flex flex-shrink-0 items-center">
                    <b className="h-8 font-bold text-3xl w-auto text-white">FRAHER</b>
                  </div>
                  <div className="xs:hidden sm:ml-6 sm:block main-menu">
                    <div className="flex space-x-4">
                      {navigation.map((item) => (
                        item.name === 'Adauga eticheta' && admin == 1 ? (
                          <a
                            key={item.name}
                            href={item.href}
                            onClick={() => {
                              setIsModalAddOpen(true);
                            }}
                            className={classNames(
                              'text-white hover:bg-green-700 hover:text-white',
                              'rounded px-3 pt-2 text-xl font-medium'
                            )}
                          >
                            {item.name}
                          </a>
                        ) : null
                      ))}
                    </div>
                  </div>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  {/*<button
                    type="button"
                    className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  >
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>*/}
  
                  {/* Profile dropdown */}
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="relative flex justify-center items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-1 focus:ring-offset-green-600 w-8 h-8">
                        <UserIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                            >
                              Schimba societate
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                            >
                              Schimba parola
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                              onClick={handleLogout}
                            >
                              Delogare
                            </a>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            </div>
  
            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className={classNames(
                      item.current ? 'bg-green-900 text-white' : 'text-white hover:bg-green-700 hover:text-white',
                      'block rounded-md px-3 py-2 text-base font-medium'
                    )}
                    aria-current={item.current ? 'page' : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
      {isModalAddOpen && (
        <ModalAdd 
          show={isModalAddOpen}
          onClose={() => setIsModalAddOpen(false)}
          onLabelAdded={() =>  {
            setRefresh(true);
            onRefresh(); // Apelarea funcției de reîmprospătare din Home.jsx
        }}
        />
      )}
      </>
    )
}
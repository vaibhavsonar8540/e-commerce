import React from 'react'
import logo from "@/../public/images/logo.webp"
import CustomImage from '../customImage'

const Header = () => {
  return (
    <div className='container py-2 px-5 flex justify-between items-center'>
            <section>
              <CustomImage 
              srcAttr={logo}
              altAttr={"logo"}
              titleAttr={"logo"}
              className="w-24"
            />
            </section>

            <section>
              {/* form input */}
            </section>
    </div>
  )
}

export default Header
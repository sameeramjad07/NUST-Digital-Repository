import React from 'react';
// import Appbar from '../components/Appbar';
import TopNav from '../components/TopNav';
import Footer from '../components/Footer';
import { FiMapPin, FiMail } from 'react-icons/fi'; // Icons for location and mail

const ContactUs = () => {
  return (
    <>
      <TopNav />
      <div className="container mx-auto px-12 py-8 ">
        <h1 className="text-5xl font-bold mb-8 text-center">Contact Us</h1>

        <div className="flex justify-center mb-8">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d293.5880568180212!2d72.98312032430579!3d33.64239765161877!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sRIC%2C%20NUST!5e0!3m2!1sen!2s!4v1677131633999!5m2!1sen!2s"
            width="90%"
            height="450"
            style={{ border: 0 }}
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen=""
            aria-hidden="false"
            tabIndex="0"
            title="RIC NUST Location"
          ></iframe>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white shadow-md p-4 border border-slate-400 rounded-lg flex items-center">
            <FiMapPin className="text-2xl text-blue-600 mr-4" />
            <div>
              <h2 className="text-xl font-semibold">Our Location</h2>
              <p className="text-gray-700">RIC NUST, Islamabad, Pakistan</p>
            </div>
          </div>
          <div className="bg-white shadow-md p-4 border border-slate-400 rounded-lg flex items-center">
            <FiMail className="text-2xl text-blue-600 mr-4" />
            <div>
              <h2 className="text-xl font-semibold">Contact Email</h2>
              <p className="text-gray-700">ddresearch@nust.edu.pk</p>
            </div>
          </div>
        </div>

      </div>
      <Footer />
    </>
  );
};

export default ContactUs;

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
        <h1 className="text-5xl font-bold mb-4 text-center">Contact Us</h1>

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
          <div className="bg-white shadow-md p-4 rounded-lg flex items-center">
            <FiMapPin className="text-2xl text-blue-600 mr-4" />
            <div>
              <h2 className="text-xl font-semibold">Our Location</h2>
              <p className="text-gray-700">RIC NUST, Islamabad, Pakistan</p>
            </div>
          </div>
          <div className="bg-white shadow-md p-4 rounded-lg flex items-center">
            <FiMail className="text-2xl text-blue-600 mr-4" />
            <div>
              <h2 className="text-xl font-semibold">Contact Email</h2>
              <p className="text-gray-700">ddresearch@nust.edu.pk</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-gray-700 font-medium">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 font-medium">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>
            <div>
              <label htmlFor="subject" className="block text-gray-700 font-medium">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-gray-700 font-medium">Message</label>
              <textarea
                id="message"
                name="message"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                rows="5"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactUs;

import React, { useState } from 'react';
import { Send, CheckCircle, Upload, Paperclip } from 'lucide-react';
import { BRAND_INFO } from '../data/furnitureData';

export default function QuoteForm({ defaultSubject = '', isModal = false, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    projectType: 'Home',
    furnitureRequirement: defaultSubject || '',
    message: '',
    file: null
  });

  const [status, setStatus] = useState('idle'); // idle, submitting, success

  const projectTypes = [
    'Home',
    'Villa',
    'Apartment',
    'Office',
    'Hotel',
    'Restaurant',
    'Commercial',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('submitting');
    setTimeout(() => {
      setStatus('success');
    }, 1200);
  };

  return (
    <div className="bg-ivory-card border border-stone-border p-6 sm:p-8 md:p-10 rounded-sm shadow-card">
      {status === 'success' ? (
        <div className="text-center py-12 space-y-4 animate-fadeIn">
          <div className="w-16 h-16 bg-sand text-walnut rounded-full flex items-center justify-center mx-auto">
            <CheckCircle size={32} />
          </div>
          <h3 className="font-serif text-3xl font-normal text-charcoal">
            Quote Request Received
          </h3>
          <p className="font-sans text-sm text-stone max-w-md mx-auto leading-relaxed">
            Thank you, <span className="font-semibold text-charcoal">{formData.name}</span>. Our technical manufacturing team in Hyderabad will review your requirements and reach out within 24 hours.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                setStatus('idle');
                setFormData({
                  name: '',
                  phone: '',
                  email: '',
                  projectType: 'Home',
                  furnitureRequirement: '',
                  message: '',
                  file: null
                });
                if (onClose) onClose();
              }}
              className="px-6 py-2.5 bg-charcoal text-white font-sans text-xs uppercase tracking-widest font-semibold hover:bg-walnut transition-colors"
            >
              Submit Another Request
            </button>
            <a
              href={`https://wa.me/${BRAND_INFO.whatsappRaw}?text=Hi,%20I%20just%20submitted%20a%20quote%20request%20for%20${encodeURIComponent(formData.projectType)}%20furniture.`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 bg-sand text-charcoal font-sans text-xs uppercase tracking-widest font-semibold hover:bg-stone-light transition-colors"
            >
              Follow Up on WhatsApp
            </a>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Name */}
            <div>
              <label className="block text-xs font-sans uppercase tracking-widest text-stone-dark font-medium mb-1.5">
                Full Name <span className="text-walnut">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Vikram Reddy"
                className="w-full px-4 py-3 bg-sand-light border border-stone-border text-sm font-sans text-charcoal focus:outline-none focus:border-charcoal transition-colors rounded-sm"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-sans uppercase tracking-widest text-stone-dark font-medium mb-1.5">
                Phone Number <span className="text-walnut">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-3 bg-sand-light border border-stone-border text-sm font-sans text-charcoal focus:outline-none focus:border-charcoal transition-colors rounded-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-sans uppercase tracking-widest text-stone-dark font-medium mb-1.5">
                Email Address <span className="text-walnut">*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full px-4 py-3 bg-sand-light border border-stone-border text-sm font-sans text-charcoal focus:outline-none focus:border-charcoal transition-colors rounded-sm"
              />
            </div>

            {/* Project Type */}
            <div>
              <label className="block text-xs font-sans uppercase tracking-widest text-stone-dark font-medium mb-1.5">
                Project Type <span className="text-walnut">*</span>
              </label>
              <select
                name="projectType"
                value={formData.projectType}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-sand-light border border-stone-border text-sm font-sans text-charcoal focus:outline-none focus:border-charcoal transition-colors rounded-sm"
              >
                {projectTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Furniture Requirement */}
          <div>
            <label className="block text-xs font-sans uppercase tracking-widest text-stone-dark font-medium mb-1.5">
              Furniture Requirement
            </label>
            <input
              type="text"
              name="furnitureRequirement"
              value={formData.furnitureRequirement}
              onChange={handleChange}
              placeholder="e.g. 8-Seater Teak Dining Table, Master Wardrobes, Office Desks"
              className="w-full px-4 py-3 bg-sand-light border border-stone-border text-sm font-sans text-charcoal focus:outline-none focus:border-charcoal transition-colors rounded-sm"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-xs font-sans uppercase tracking-widest text-stone-dark font-medium mb-1.5">
              Project Details & Spatial Dimensions
            </label>
            <textarea
              name="message"
              rows={3}
              value={formData.message}
              onChange={handleChange}
              placeholder="Describe your timeline, material preferences, or space dimensions..."
              className="w-full px-4 py-3 bg-sand-light border border-stone-border text-sm font-sans text-charcoal focus:outline-none focus:border-charcoal transition-colors rounded-sm resize-none"
            />
          </div>

          {/* Reference Image Upload Mock */}
          <div>
            <label className="block text-xs font-sans uppercase tracking-widest text-stone-dark font-medium mb-1.5">
              Upload Reference Image / Drawing (Optional)
            </label>
            <div className="relative border border-dashed border-stone-border bg-sand-light p-4 text-center rounded-sm hover:border-walnut transition-colors">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              />
              <div className="flex items-center justify-center gap-2 text-stone text-xs font-sans">
                <Paperclip size={16} className="text-walnut" />
                <span>
                  {formData.file ? (
                    <strong className="text-charcoal">{formData.file.name}</strong>
                  ) : (
                    'Attach CAD drawing, photo reference, or floor plan (Max 10MB)'
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full py-4 bg-charcoal text-white font-sans text-xs uppercase tracking-widest font-semibold hover:bg-walnut transition-colors duration-200 shadow-card flex items-center justify-center gap-2"
          >
            {status === 'submitting' ? (
              <span>Processing Request...</span>
            ) : (
              <>
                <span>Request a Quote</span>
                <Send size={14} />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}

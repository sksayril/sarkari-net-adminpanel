import React, { useState, useEffect } from 'react';
import { FileText, ChevronDown, ChevronUp, Copy, Check, Plus, Edit, Trash2, Save, X } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  template: string;
  isCustom?: boolean;
}

interface DefaultContentTemplateProps {
  onUseTemplate: (template: string) => void;
}

const DefaultContentTemplate: React.FC<DefaultContentTemplateProps> = ({ onUseTemplate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    template: ''
  });

  // Default templates
  const defaultTemplates: Template[] = [
    {
      id: 'basic-content',
      name: 'Basic Content Structure',
      description: 'Simple content with headings and paragraphs',
      template: `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <h1 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; margin-bottom: 20px;">
    Main Heading
  </h1>
  
  <p style="margin-bottom: 15px; text-align: justify;">
    This is a paragraph with some basic content. You can add more text here to provide detailed information about your topic.
  </p>
  
  <h2 style="color: #34495e; margin-top: 25px; margin-bottom: 15px;">
    Sub Heading
  </h2>
  
  <p style="margin-bottom: 15px; text-align: justify;">
    Another paragraph with additional information. This helps in organizing your content in a structured manner.
  </p>
  
  <ul style="margin: 15px 0; padding-left: 20px;">
    <li style="margin-bottom: 8px;">First important point</li>
    <li style="margin-bottom: 8px;">Second important point</li>
    <li style="margin-bottom: 8px;">Third important point</li>
  </ul>
</div>
      `
    },
    {
      id: 'information-table',
      name: 'Information Table',
      description: 'Structured information in a table format',
      template: `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <h2 style="color: #2c3e50; margin-bottom: 20px;">Important Information</h2>
  
  <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd; margin: 20px 0;">
    <thead>
      <tr style="background-color: #f8f9fa;">
        <th style="padding: 12px; border: 1px solid #ddd; text-align: left; font-weight: bold;">Category</th>
        <th style="padding: 12px; border: 1px solid #ddd; text-align: left; font-weight: bold;">Details</th>
        <th style="padding: 12px; border: 1px solid #ddd; text-align: left; font-weight: bold;">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding: 12px; border: 1px solid #ddd;">Application Process</td>
        <td style="padding: 12px; border: 1px solid #ddd;">Online application form submission</td>
        <td style="padding: 12px; border: 1px solid #ddd; color: #28a745;">Active</td>
      </tr>
      <tr style="background-color: #f8f9fa;">
        <td style="padding: 12px; border: 1px solid #ddd;">Documentation</td>
        <td style="padding: 12px; border: 1px solid #ddd;">Required certificates and ID proof</td>
        <td style="padding: 12px; border: 1px solid #ddd; color: #ffc107;">Pending</td>
      </tr>
      <tr>
        <td style="padding: 12px; border: 1px solid #ddd;">Interview</td>
        <td style="padding: 12px; border: 1px solid #ddd;">Written test and personal interview</td>
        <td style="padding: 12px; border: 1px solid #ddd; color: #dc3545;">Not Started</td>
      </tr>
    </tbody>
  </table>
</div>
      `
    },
    {
      id: 'highlighted-content',
      name: 'Highlighted Content',
      description: 'Content with colored highlights and emphasis',
      template: `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <h1 style="color: #2c3e50; text-align: center; margin-bottom: 30px;">
    🎯 Important Notice
  </h1>
  
  <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px; margin: 20px 0;">
    <h3 style="color: #856404; margin-top: 0; margin-bottom: 15px;">⚠️ Important Information</h3>
    <p style="color: #856404; margin: 0;">
      This is a highlighted notice box. Use this to draw attention to important information that users need to know.
    </p>
  </div>
  
  <div style="background-color: #d1ecf1; border: 1px solid #bee5eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
    <h3 style="color: #0c5460; margin-top: 0; margin-bottom: 15px;">ℹ️ Information</h3>
    <p style="color: #0c5460; margin: 0;">
      This is an information box. Use this for general information and helpful tips.
    </p>
  </div>
  
  <div style="background-color: #d4edda; border: 1px solid #c3e6cb; border-radius: 8px; padding: 20px; margin: 20px 0;">
    <h3 style="color: #155724; margin-top: 0; margin-bottom: 15px;">✅ Success</h3>
    <p style="color: #155724; margin: 0;">
      This is a success box. Use this to show positive outcomes or completed actions.
    </p>
  </div>
</div>
      `
    },
    {
      id: 'step-by-step',
      name: 'Step-by-Step Guide',
      description: 'Numbered steps with icons and descriptions',
      template: `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <h2 style="color: #2c3e50; margin-bottom: 25px;">📋 Step-by-Step Process</h2>
  
  <div style="margin-bottom: 20px;">
    <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
      <div style="background-color: #3498db; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; flex-shrink: 0;">1</div>
      <div>
        <h4 style="margin: 0 0 8px 0; color: #2c3e50;">Registration</h4>
        <p style="margin: 0; color: #666;">Complete the online registration form with your personal details and contact information.</p>
      </div>
    </div>
  </div>
  
  <div style="margin-bottom: 20px;">
    <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
      <div style="background-color: #3498db; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; flex-shrink: 0;">2</div>
      <div>
        <h4 style="margin: 0 0 8px 0; color: #2c3e50;">Document Upload</h4>
        <p style="margin: 0; color: #666;">Upload all required documents including ID proof, certificates, and photographs.</p>
      </div>
    </div>
  </div>
  
  <div style="margin-bottom: 20px;">
    <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
      <div style="background-color: #3498db; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; flex-shrink: 0;">3</div>
      <div>
        <h4 style="margin: 0 0 8px 0; color: #2c3e50;">Application Review</h4>
        <p style="margin: 0; color: #666;">Your application will be reviewed by the authorities within 5-7 working days.</p>
      </div>
    </div>
  </div>
  
  <div style="margin-bottom: 20px;">
    <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
      <div style="background-color: #3498db; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; flex-shrink: 0;">4</div>
      <div>
        <h4 style="margin: 0 0 8px 0; color: #2c3e50;">Final Approval</h4>
        <p style="margin: 0; color: #666;">Upon successful review, you will receive final approval and further instructions.</p>
      </div>
    </div>
  </div>
</div>
      `
    },
    {
      id: 'contact-info',
      name: 'Contact Information',
      description: 'Structured contact details with icons',
      template: `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <h2 style="color: #2c3e50; margin-bottom: 25px;">📞 Contact Information</h2>
  
  <div style="background-color: #f8f9fa; border-radius: 8px; padding: 25px; margin: 20px 0;">
    <div style="margin-bottom: 20px;">
      <h4 style="color: #2c3e50; margin: 0 0 10px 0;">🏢 Office Address</h4>
      <p style="margin: 0; color: #666;">
        Government Building, Sector 15<br>
        New Delhi, Delhi 110001<br>
        India
      </p>
    </div>
    
    <div style="margin-bottom: 20px;">
      <h4 style="color: #2c3e50; margin: 0 0 10px 0;">📧 Email</h4>
      <p style="margin: 0; color: #666;">
        <a href="mailto:info@example.gov.in" style="color: #3498db; text-decoration: none;">info@example.gov.in</a>
      </p>
    </div>
    
    <div style="margin-bottom: 20px;">
      <h4 style="color: #2c3e50; margin: 0 0 10px 0;">📞 Phone</h4>
      <p style="margin: 0; color: #666;">
        <a href="tel:+911123456789" style="color: #3498db; text-decoration: none;">+91 11 2345 6789</a>
      </p>
    </div>
    
    <div style="margin-bottom: 20px;">
      <h4 style="color: #2c3e50; margin: 0 0 10px 0;">🕒 Working Hours</h4>
      <p style="margin: 0; color: #666;">
        Monday to Friday: 9:00 AM - 6:00 PM<br>
        Saturday: 9:00 AM - 1:00 PM<br>
        Sunday: Closed
      </p>
    </div>
  </div>
</div>
      `
    },
    {
      id: 'requirements-checklist',
      name: 'Requirements Checklist',
      description: 'Checkable list of requirements and documents',
      template: `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <h2 style="color: #2c3e50; margin-bottom: 25px;">📋 Required Documents</h2>
  
  <div style="background-color: #f8f9fa; border-radius: 8px; padding: 25px; margin: 20px 0;">
    <h3 style="color: #2c3e50; margin-top: 0; margin-bottom: 20px;">Essential Documents</h3>
    
    <div style="margin-bottom: 15px;">
      <div style="display: flex; align-items: center; margin-bottom: 10px;">
        <div style="width: 20px; height: 20px; border: 2px solid #3498db; border-radius: 3px; margin-right: 10px; display: flex; align-items: center; justify-content: center;">
          <div style="width: 12px; height: 12px; background-color: #3498db; border-radius: 1px;"></div>
        </div>
        <span style="color: #2c3e50; font-weight: 500;">Aadhaar Card (Original + Copy)</span>
      </div>
      <p style="margin: 0 0 0 30px; color: #666; font-size: 14px;">Valid Aadhaar card with current address</p>
    </div>
    
    <div style="margin-bottom: 15px;">
      <div style="display: flex; align-items: center; margin-bottom: 10px;">
        <div style="width: 20px; height: 20px; border: 2px solid #3498db; border-radius: 3px; margin-right: 10px; display: flex; align-items: center; justify-content: center;">
          <div style="width: 12px; height: 12px; background-color: #3498db; border-radius: 1px;"></div>
        </div>
        <span style="color: #2c3e50; font-weight: 500;">PAN Card (Original + Copy)</span>
      </div>
      <p style="margin: 0 0 0 30px; color: #666; font-size: 14px;">Permanent Account Number card</p>
    </div>
    
    <div style="margin-bottom: 15px;">
      <div style="display: flex; align-items: center; margin-bottom: 10px;">
        <div style="width: 20px; height: 20px; border: 2px solid #3498db; border-radius: 3px; margin-right: 10px; display: flex; align-items: center; justify-content: center;">
          <div style="width: 12px; height: 12px; background-color: #3498db; border-radius: 1px;"></div>
        </div>
        <span style="color: #2c3e50; font-weight: 500;">Educational Certificates</span>
      </div>
      <p style="margin: 0 0 0 30px; color: #666; font-size: 14px;">All relevant educational certificates and mark sheets</p>
    </div>
    
    <div style="margin-bottom: 15px;">
      <div style="display: flex; align-items: center; margin-bottom: 10px;">
        <div style="width: 20px; height: 20px; border: 2px solid #3498db; border-radius: 3px; margin-right: 10px; display: flex; align-items: center; justify-content: center;">
          <div style="width: 12px; height: 12px; background-color: #3498db; border-radius: 1px;"></div>
        </div>
        <span style="color: #2c3e50; font-weight: 500;">Passport Size Photographs</span>
      </div>
      <p style="margin: 0 0 0 30px; color: #666; font-size: 14px;">Recent passport size photographs (3 copies)</p>
    </div>
    
    <div style="margin-bottom: 15px;">
      <div style="display: flex; align-items: center; margin-bottom: 10px;">
        <div style="width: 20px; height: 20px; border: 2px solid #3498db; border-radius: 3px; margin-right: 10px; display: flex; align-items: center; justify-content: center;">
          <div style="width: 12px; height: 12px; background-color: #3498db; border-radius: 1px;"></div>
        </div>
        <span style="color: #2c3e50; font-weight: 500;">Experience Certificate</span>
      </div>
      <p style="margin: 0 0 0 30px; color: #666; font-size: 14px;">Previous work experience certificates (if applicable)</p>
    </div>
  </div>
</div>
      `
    }
  ];

  // Load templates from localStorage on component mount
  useEffect(() => {
    const savedCustomTemplates = localStorage.getItem('customTemplates');
    if (savedCustomTemplates) {
      const customTemplates = JSON.parse(savedCustomTemplates);
      setTemplates([...defaultTemplates, ...customTemplates]);
    } else {
      setTemplates(defaultTemplates);
    }
  }, []);

  // Save custom templates to localStorage
  const saveCustomTemplates = (customTemplates: Template[]) => {
    localStorage.setItem('customTemplates', JSON.stringify(customTemplates));
  };

  const handleCopyTemplate = async (template: string, templateName: string) => {
    try {
      await navigator.clipboard.writeText(template);
      setCopiedTemplate(templateName);
      setTimeout(() => setCopiedTemplate(null), 2000);
    } catch (error) {
      console.error('Failed to copy template:', error);
    }
  };

  const handleUseTemplate = (template: string) => {
    onUseTemplate(template);
    setIsExpanded(false);
  };

  const handleAddTemplate = () => {
    if (newTemplate.name && newTemplate.description && newTemplate.template) {
      const customTemplate: Template = {
        id: `custom-${Date.now()}`,
        name: newTemplate.name,
        description: newTemplate.description,
        template: newTemplate.template,
        isCustom: true
      };

      const updatedTemplates = [...templates, customTemplate];
      setTemplates(updatedTemplates);
      
      // Save custom templates to localStorage
      const customTemplates = updatedTemplates.filter(t => t.isCustom);
      saveCustomTemplates(customTemplates);

      // Reset form
      setNewTemplate({ name: '', description: '', template: '' });
      setShowAddForm(false);
    }
  };

  const handleEditTemplate = (template: Template) => {
    setEditingTemplate(template);
    setNewTemplate({
      name: template.name,
      description: template.description,
      template: template.template
    });
    setShowAddForm(true);
  };

  const handleUpdateTemplate = () => {
    if (editingTemplate && newTemplate.name && newTemplate.description && newTemplate.template) {
      const updatedTemplates = templates.map(t => 
        t.id === editingTemplate.id 
          ? { ...t, name: newTemplate.name, description: newTemplate.description, template: newTemplate.template }
          : t
      );
      setTemplates(updatedTemplates);
      
      // Save custom templates to localStorage
      const customTemplates = updatedTemplates.filter(t => t.isCustom);
      saveCustomTemplates(customTemplates);

      // Reset form
      setNewTemplate({ name: '', description: '', template: '' });
      setEditingTemplate(null);
      setShowAddForm(false);
    }
  };

  const handleDeleteTemplate = (templateId: string) => {
    const updatedTemplates = templates.filter(t => t.id !== templateId);
    setTemplates(updatedTemplates);
    
    // Save custom templates to localStorage
    const customTemplates = updatedTemplates.filter(t => t.isCustom);
    saveCustomTemplates(customTemplates);
  };

  const handleCancelEdit = () => {
    setNewTemplate({ name: '', description: '', template: '' });
    setEditingTemplate(null);
    setShowAddForm(false);
  };

  return (
    <div className="mb-4">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <span className="font-medium text-blue-900">HTML Content Templates</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-blue-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-blue-600" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">
              Choose from these pre-built HTML templates to get started with your content. You can customize them further using the rich text editor.
            </p>
            <button
              type="button"
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Template
            </button>
          </div>

          {/* Add/Edit Template Form */}
          {showAddForm && (
            <div className="mb-6 p-4 bg-white border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingTemplate ? 'Edit Template' : 'Add New Template'}
                </h3>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="p-1 text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Template Name *
                  </label>
                  <input
                    type="text"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter template name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <input
                    type="text"
                    value={newTemplate.description}
                    onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter template description"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    HTML Template *
                  </label>
                  <textarea
                    value={newTemplate.template}
                    onChange={(e) => setNewTemplate({ ...newTemplate, template: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={8}
                    placeholder="Enter your HTML template code here..."
                  />
                </div>
                
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={editingTemplate ? handleUpdateTemplate : handleAddTemplate}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                    disabled={!newTemplate.name || !newTemplate.description || !newTemplate.template}
                  >
                    <Save className="w-4 h-4 mr-2 inline" />
                    {editingTemplate ? 'Update Template' : 'Add Template'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-4 py-2 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <div className="grid gap-4">
            {templates.map((template, index) => (
              <div key={template.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">{template.name}</h4>
                    <p className="text-sm text-gray-600">{template.description}</p>
                    {template.isCustom && (
                      <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full mt-1">
                        Custom Template
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyTemplate(template.template, template.name)}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                      title="Copy template"
                    >
                      {copiedTemplate === template.name ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    {template.isCustom && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleEditTemplate(template)}
                          className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-100 rounded transition-colors"
                          title="Edit template"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="p-2 text-red-600 hover:text-red-900 hover:bg-red-100 rounded transition-colors"
                          title="Delete template"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleUseTemplate(template.template)}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Use Template
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DefaultContentTemplate; 
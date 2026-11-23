import * as models from '../models/index.js';

// Default services data for fallback
const DEFAULT_SERVICES = [
  {
    title: 'General Construction Services',
    description: 'Construction services for residential, commercial, and institutional projects, including site preparation, foundations, structural work, and external works.',
    icon: 'fa-tools',
    image_url: '/static/images/general-construction.jfif'
  },
  {
    title: 'Design & Planning',
    description: 'Design and planning support may include concept development, architectural drawings, structural plans, and guidance on approval processes, depending on project requirements.',
    icon: 'fa-tools',
    image_url: '/static/images/design-work.jpg'
  },
  {
    title: 'Project Management',
    description: 'Project coordination may include contractor coordination, procurement support, quality checks, and progress updates based on the agreed project scope.',
    icon: 'fa-tools',
    image_url: '/static/images/cart-excavator.jpg'
  },
  {
    title: 'Renovation & Remodeling',
    description: 'Breathe new life into your existing property with our renovation and remodeling services. From complete interior overhauls and room additions to kitchen upgrades, bathroom renovations, and façade improvements, we transform tired spaces into modern, functional environments.',
    icon: 'fa-tools',
    image_url: '/static/images/renovation-work.jfif'
  },
  {
    title: 'Civil & Infrastructure Works',
    description: 'Civil and infrastructure services may include roads, bridges, drainage systems, water supply networks, and public utilities. Project scope and applicable requirements are discussed for each project.',
    icon: 'fa-tools',
    image_url: '/static/images/civil-and-infrastructure-works.webp'
  },
  {
    title: 'Mechanical, Electrical & Plumbing (MEP)',
    description: 'Mechanical, electrical, and plumbing installation services for buildings, including support for power, water, drainage, and other building systems.',
    icon: 'fa-tools',
    image_url: '/static/images/design-mechanical-electrical-works.jfif'
  }
];

const SERVICE_IMAGE_MAP = {
  'General Construction Services': '/static/images/general-construction.jfif',
  'Design & Planning': '/static/images/design-work.jpg',
  'Project Management': '/static/images/cart-excavator.jpg',
  'Renovation & Remodeling': '/static/images/renovation-work.jfif',
  'Civil & Infrastructure Works': '/static/images/civil-and-infrastructure-works.webp',
  'Mechanical, Electrical & Plumbing (MEP)': '/static/images/design-mechanical-electrical-works.jfif',
};

const MACHINE_IMAGE_MAP = {
  'excavator': '/static/images/cart-excavator.jpg',
  'tipper': '/static/images/tipper-truck.jfif',
  'truck': '/static/images/tipper-truck.jfif',
  'mixer': '/static/images/concrete-mixer.jfif',
  'concrete': '/static/images/concrete-mixer.jfif',
  'compactor': '/static/images/compactor-roler.jfif',
  'roller': '/static/images/compactor-roler.jfif',
  'crane': '/static/images/tower-crane.jpg',
  'generator': '/static/images/GEnerator-vibrator.jfif',
  'water': '/static/images/water-bowser.jfif',
  'bowser': '/static/images/water-bowser.jfif',
  'tanker': '/static/images/water-bowser.jfif',
  'welding': '/static/images/welding-machine.jfif',
};

const TEAM_PHOTO_MAP = {
  "Felix Ochieng'": '/static/images/team/felix-ochieng.jpeg',
  'Maxwell Okoth': '/static/images/team/maxwell.jfif',
  'Reagan Obondo': '/static/images/team/reagan-obondo.jpg',
  'Ronex': '/static/images/team/ronex.jfif',
  'Richard': '/static/images/team/richard.jpg',
};

function getMachineImageUrl(machine) {
  if (machine.image) return machine.image;
  const name = machine.name.toLowerCase();
  for (const [key, url] of Object.entries(MACHINE_IMAGE_MAP)) {
    if (name.includes(key)) return url;
  }
  return '/static/images/general-construction.jfif';
}

function getTeamPhotoUrl(member) {
  return TEAM_PHOTO_MAP[member.name] || (member.photo ? member.photo : '/static/images/team/maxwell.jfif');
}

function normalizeService(service) {
  return {
    ...service,
    image_url: service.image_url || service.image || SERVICE_IMAGE_MAP[service.title] || '/static/images/general-construction.jfif',
  };
}

export async function home(req, res) {
  try {
    const featuredServices = (await models.getAllServices()).slice(0, 6).map(normalizeService);
    const featuredProjects = (await models.getFeaturedProjects()) || [];
    const testimonials = (await models.getAllTestimonials()) || [];

    res.render('home', {
      featuredServices,
      featuredProjects,
      testimonials,
    });
  } catch (error) {
    console.error('Error in home controller:', error);
    res.render('home', {
      featuredServices: [],
      featuredProjects: [],
      testimonials: [],
    });
  }
}

export async function services(req, res) {
  try {
    let all_services = await models.getAllServices();
    
    if (!all_services || all_services.length === 0) {
      all_services = DEFAULT_SERVICES;
    } else {
      const existing_titles = new Set(all_services.map(s => s.title.trim().toLowerCase()));
      const missing = DEFAULT_SERVICES.filter(s => !existing_titles.has(s.title.trim().toLowerCase()));
      all_services = [...all_services, ...missing];
    }

    res.render('services', { services: all_services.map(normalizeService) });
  } catch (error) {
    console.error('Error in services controller:', error);
    res.render('services', { services: DEFAULT_SERVICES });
  }
}

export async function projects(req, res) {
  try {
    const completed = await models.getProjectsByStatus('completed');
    const ongoing = await models.getProjectsByStatus('ongoing');
    const machines = await models.getAllMachines();
    
    res.render('projects', {
      completedProjects: completed,
      ongoingProjects: ongoing,
      equipment: machines.map(machine => ({
        ...machine,
        image: getMachineImageUrl(machine),
      })),
    });
  } catch (error) {
    console.error('Error in projects controller:', error);
    res.render('projects', {
      completedProjects: [],
      ongoingProjects: [],
      equipment: [],
    });
  }
}

export async function about(req, res) {
  try {
    const teamMembers = await models.getAllTeamMembers();
    teamMembers.forEach(member => member.photo_url = getTeamPhotoUrl(member));

    res.render('about', { teamMembers });
  } catch (error) {
    console.error('Error in about controller:', error);
    res.render('about', { teamMembers: [] });
  }
}

export async function contact(req, res) {
  if (req.method === 'GET') {
    const successMessage = req.query.submitted === 'contact'
      ? 'Thank you for reaching out! We will get back to you shortly.'
      : req.query.submitted === 'consultation'
        ? 'Your consultation has been booked! We will confirm shortly.'
        : null;

    return res.render('contact', {
      contact_form: {},
      consultation_form: {},
      messages: successMessage ? [{ type: 'success', text: successMessage }] : [],
    });
  }

  const form = req.body || {};
  const formType = form.form_type;
  const isContactForm = formType === 'contact';
  const isConsultationForm = formType === 'consultation';

  if (!isContactForm && !isConsultationForm) {
    return res.status(400).render('contact', {
      contact_form: {},
      consultation_form: {},
      messages: [{ type: 'error', text: 'Invalid form submission. Please try again.' }],
    });
  }

  const requiredFields = isContactForm
    ? ['name', 'email', 'message']
    : ['name', 'email', 'phone', 'preferred_date', 'preferred_time'];

  if (requiredFields.some(field => !String(form[field] || '').trim())) {
    return res.status(400).render('contact', {
      contact_form: isContactForm ? form : {},
      consultation_form: isConsultationForm ? form : {},
      messages: [{ type: 'error', text: 'Please fill in all required fields.' }],
    });
  }

  try {
    if (isContactForm) {
      const { name, email, phone, message } = form;
      await models.createContactMessage({ name, email, phone, message });
    } else {
      const { name, email, phone, service_interest, preferred_date, preferred_time, message } = form;
      await models.createConsultationBooking({
        name,
        email,
        phone,
        service_interest,
        preferred_date,
        preferred_time,
        message,
      });
    }

    return res.redirect(`/contact?submitted=${formType}`);
  } catch (error) {
    console.error(`Error saving ${formType} form:`, error);
    return res.status(500).render('contact', {
      contact_form: isContactForm ? form : {},
      consultation_form: isConsultationForm ? form : {},
      messages: [{
        type: 'error',
        text: isContactForm
          ? 'Error sending message. Please try again.'
          : 'Error booking consultation. Please try again.',
      }],
    });
  }
}

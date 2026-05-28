import * as models from '../models/index.js';
import { getStaticUrl } from '../utils/helpers.js';

// Default services data for fallback
const DEFAULT_SERVICES = [
  {
    title: 'General Construction Services',
    description: 'We undertake full-scale construction projects for residential, commercial, and institutional clients. Our experienced team manages everything from site preparation and foundation to structural framing and external works, delivering durable, high-quality buildings on time and within budget.',
    icon: 'fa-tools',
    image_url: '/static/images/general-construction.jfif'
  },
  {
    title: 'Design & Planning',
    description: 'Our in-house architects and design engineers create functional, aesthetically refined plans tailored to your vision and budget. We handle concept development, detailed architectural drawings, structural designs, and obtain all necessary approvals from regulatory authorities.',
    icon: 'fa-tools',
    image_url: '/static/images/design-work.jpg'
  },
  {
    title: 'Project Management',
    description: 'Expert end-to-end project management ensures your construction project is delivered efficiently. We coordinate contractors, manage procurement, monitor quality, and provide regular progress reports — keeping your project on schedule and on budget at every stage.',
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
    description: 'We design and construct vital civil infrastructure including roads, bridges, drainage systems, water supply networks, and public utilities. Our civil engineering team brings technical expertise to every project, ensuring safe, durable, and code-compliant infrastructure.',
    icon: 'fa-tools',
    image_url: '/static/images/civil-and-infrastructure-works.webp'
  },
  {
    title: 'Mechanical, Electrical & Plumbing (MEP)',
    description: 'Complete mechanical, electrical, and plumbing installations handled by certified, experienced technicians. We provide dependable MEP solutions for buildings, ensuring performance, safety, and compliance across all systems.',
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
  'Samuel Oketch': '/static/images/team/samuel.jpeg',
  'Mike Onyango': '/static/images/team/mica.png',
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

export async function home(req, res) {
  try {
    const featured_services = (await models.getAllServices()).slice(0, 6) || [];
    const featured_projects = (await models.getFeaturedProjects()) || [];
    const testimonials = (await models.getAllTestimonials()) || [];

    res.render('home', {
      featured_services,
      featured_projects,
      testimonials,
    });
  } catch (error) {
    console.error('Error in home controller:', error);
    res.render('home', {
      featured_services: [],
      featured_projects: [],
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

    res.render('services', { services: all_services });
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
    
    machines.forEach(m => m.image_url = getMachineImageUrl(m));

    res.render('projects', {
      completed_projects: completed,
      ongoing_projects: ongoing,
      machines,
    });
  } catch (error) {
    console.error('Error in projects controller:', error);
    res.render('projects', {
      completed_projects: [],
      ongoing_projects: [],
      machines: [],
    });
  }
}

export async function about(req, res) {
  try {
    const team = await models.getAllTeamMembers();
    team.forEach(member => member.photo_url = getTeamPhotoUrl(member));

    res.render('about', { team });
  } catch (error) {
    console.error('Error in about controller:', error);
    res.render('about', { team: [] });
  }
}

export async function contact(req, res) {
  if (req.method === 'GET') {
    res.render('contact', {
      contact_form: {},
      consultation_form: {},
      message: null,
    });
  } else {
    const form_type = req.body.form_type;

    if (form_type === 'contact') {
      const { name, email, phone, message } = req.body;
      
      if (!name || !email || !message) {
        return res.render('contact', {
          contact_form: req.body,
          consultation_form: {},
          message: 'Please fill in all required fields.',
        });
      }

      try {
        await models.createContactMessage({ name, email, phone, message });
        req.session.message = 'Thank you for reaching out! We will get back to you shortly.';
        return res.redirect('/contact');
      } catch (error) {
        console.error('Error saving contact message:', error);
        return res.render('contact', {
          contact_form: req.body,
          consultation_form: {},
          message: 'Error sending message. Please try again.',
        });
      }
    } else if (form_type === 'consultation') {
      const { name, email, phone, service_interest, preferred_date, preferred_time, message } = req.body;

      if (!name || !email || !phone || !preferred_date || !preferred_time) {
        return res.render('contact', {
          contact_form: {},
          consultation_form: req.body,
          message: 'Please fill in all required fields.',
        });
      }

      try {
        await models.createConsultationBooking({
          name,
          email,
          phone,
          service_interest,
          preferred_date,
          preferred_time,
          message,
        });
        req.session.message = 'Your consultation has been booked! We will confirm shortly.';
        return res.redirect('/contact');
      } catch (error) {
        console.error('Error saving consultation booking:', error);
        return res.render('contact', {
          contact_form: {},
          consultation_form: req.body,
          message: 'Error booking consultation. Please try again.',
        });
      }
    }
  }
}

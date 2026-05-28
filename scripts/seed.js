import * as models from '../src/models/index.js';
import { initializeDatabase } from '../src/db/index.js';

async function seedDatabase() {
  try {
    console.log('🌱 Initializing database...');
    await initializeDatabase();
    console.log('✅ Database initialized');

    console.log('🌱 Seeding team members...');
    
    const teamMembers = [
      {
        name: 'Felix Ochieng\'',
        role: 'Founder & Chief Executive Officer',
        bio: 'Felix is the visionary founder of Ka\'sam Construction Enterprise with over 15 years of experience in construction project management. Known for his strategic thinking and commitment to excellence, Felix leads the company with integrity and a focus on sustainable growth.',
        photo: '/static/images/team/maxwell.jfif',
        email: 'felix@kasamenterprises.com',
        phone: '+254 714 712 531',
        linkedin: 'https://linkedin.com/in/felix-ochieng',
        order: 1
      },
      {
        name: 'Maxwell Okoth',
        role: 'Lead Architect',
        bio: 'Maxwell is a creative and technically proficient architect who combines innovative design with practical construction knowledge. With 12 years of experience, he delivers spaces that are both beautiful and functional, ensuring every project meets aesthetic and structural requirements.',
        photo: '/static/images/team/maxwell.jfif',
        email: 'maxwell@kasamenterprises.com',
        phone: '+254 722 445 566',
        linkedin: 'https://linkedin.com/in/maxwell-okoth',
        order: 2
      },
      {
        name: 'Samuel Oketch',
        role: 'Project Manager',
        bio: 'Samuel is an experienced project manager with a proven track record of delivering complex construction projects on time and within budget. He ensures seamless coordination between all stakeholders, from design to final handover.',
        photo: '/static/images/team/maxwell.jfif',
        email: 'samuel@kasamenterprises.com',
        phone: '+254 723 334 455',
        linkedin: 'https://linkedin.com/in/samuel-oketch',
        order: 3
      },
      {
        name: 'Ronald Obondo',
        role: 'Site Supervisor',
        bio: 'Ronald brings 10 years of on-site construction experience and ensures that every project is executed to the highest safety and quality standards. His attention to detail and leadership is crucial to our project success.',
        photo: '/static/images/team/maxwell.jfif',
        email: 'ronald@kasamenterprises.com',
        phone: '+254 724 556 677',
        linkedin: 'https://linkedin.com/in/ronald-obondo',
        order: 4
      },
      {
        name: 'Ronex Kipchoge',
        role: 'Roofing Specialist',
        bio: 'Ronex leads our roofing division with expertise in all roofing systems including iron sheets, tiles, flat roofs, and specialized waterproof membranes. Known for precision installation and durability that lasts decades.',
        photo: '/static/images/team/ronex.jfif',
        email: 'ronex@kasamenterprises.com',
        phone: '+254 725 667 788',
        order: 5
      },
      {
        name: 'Mike Onyango',
        role: 'Structural Engineer',
        bio: 'Mike is a licensed structural engineer with deep expertise in complex building systems. He ensures all structures meet or exceed building codes and engineering standards, providing safe, durable foundations for every project.',
        photo: '/static/images/team/maxwell.jfif',
        email: 'mike@kasamenterprises.com',
        phone: '+254 726 778 899',
        linkedin: 'https://linkedin.com/in/mike-onyango',
        order: 6
      }
    ];

    for (const member of teamMembers) {
      try {
        await models.createTeamMember(member);
        console.log(`✅ Added team member: ${member.name}`);
      } catch (error) {
        if (error.message.includes('UNIQUE constraint failed')) {
          console.log(`⏭️  Team member already exists: ${member.name}`);
        } else {
          console.error(`❌ Error adding ${member.name}:`, error.message);
        }
      }
    }

    console.log('🌱 Seeding testimonials...');

    const testimonials = [
      {
        client_name: 'Jane Kipchoge',
        client_role: 'Property Developer',
        client_company: 'Kipchoge Properties Ltd',
        photo: null,
        message: 'Ka\'sam Construction delivered our residential estate on time and within budget. Their professionalism, quality workmanship, and attention to detail exceeded our expectations. Highly recommended for any construction project.',
        rating: 5
      },
      {
        client_name: 'David Mwangi',
        client_role: 'Managing Director',
        client_company: 'Mwangi Commercial Solutions',
        photo: null,
        message: 'We hired Ka\'sam for a complex commercial renovation project. Their team handled everything seamlessly — from initial planning to final inspection. Their project management skills are exceptional.',
        rating: 5
      },
      {
        client_name: 'Grace Achieng',
        client_role: 'School Principal',
        client_company: 'Kisumu Central School',
        photo: null,
        message: 'Ka\'sam constructed our new classroom block and administration building. The quality is outstanding, and they were incredibly cooperative working around our school schedule. Best decision we made!',
        rating: 5
      },
      {
        client_name: 'Joseph Kariuki',
        client_role: 'Infrastructure Director',
        client_company: 'County Government of Kisumu',
        photo: null,
        message: 'For our road infrastructure project, Ka\'sam demonstrated exceptional engineering expertise and commitment to quality standards. Their team completed the project ahead of schedule without compromising on quality.',
        rating: 5
      },
      {
        client_name: 'Amelia Okoth',
        client_role: 'Homeowner',
        client_company: 'Self-employed',
        photo: null,
        message: 'I couldn\'t be happier with our home renovation. The Ka\'sam team transformed our tired 1990s house into a modern, beautiful space. They were professional, respectful, and meticulous in their work.',
        rating: 5
      },
      {
        client_name: 'Marcus Ngugi',
        client_role: 'CEO',
        client_company: 'Tech Hub Kisumu',
        photo: null,
        message: 'We engaged Ka\'sam to build our tech hub office space. Their understanding of modern office design requirements and technical infrastructure needs was impressive. Outstanding partner to work with.',
        rating: 5
      }
    ];

    for (const testimonial of testimonials) {
      try {
        await models.createTestimonial(testimonial);
        console.log(`✅ Added testimonial from: ${testimonial.client_name}`);
      } catch (error) {
        console.error(`❌ Error adding testimonial from ${testimonial.client_name}:`, error.message);
      }
    }

    console.log('✅ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();

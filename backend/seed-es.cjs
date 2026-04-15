//FILE NÀY CHỈ ĐỂ TEST PHẦN ELASTICSEARCH
//SAU NÀY PHÁT TRIỂN THÊM PHẦN ĐĂNG CV THÌ XÓA


const { Client } = require('@elastic/elasticsearch');

// Kết nối tới Elasticsearch (đang chạy trên Docker)
const client = new Client({ node: 'http://localhost:9200' });

async function seed() {
  console.log('⏳ Bắt đầu seed dữ liệu...');

  try {
    // 1. Xoá index cũ (nếu có) để chạy sạch
    try {
      await client.indices.delete({ index: 'candidates' });
      console.log('Đã xoá index candidates cũ');
    } catch (e) {
      console.log('Index candidates chưa tồn tại, bỏ qua');
    }
    try {
      await client.indices.delete({ index: 'jobs' });
      console.log('Đã xoá index jobs cũ');
    } catch (e) {
      console.log('Index jobs chưa tồn tại, bỏ qua');
    }

    // 2. Tạo index candidates với mapping (cấu trúc trường)
    await client.indices.create({
      index: 'candidates',
      mappings: {
        properties: {
          skills: { type: 'text' },
          education: { type: 'text' },
          location: { type: 'text' },
          experience: { type: 'integer' }
        }
      }
    });
    console.log('✅ Đã tạo index "candidates"');

    // 3. Thêm dữ liệu mẫu cho candidates
    const candidates = [
      { skills: 'React, JavaScript, HTML/CSS', education: 'Đại học Bách Khoa Hà Nội', location: 'Hà Nội', experience: 3 },
      { skills: 'Node.js, Express, MongoDB', education: 'Đại học Công nghệ TP.HCM', location: 'Hồ Chí Minh', experience: 2 },
      { skills: 'Python, Django, PostgreSQL', education: 'Đại học Khoa học Tự nhiên', location: 'Đà Nẵng', experience: 4 },
      { skills: 'Java, Spring Boot, MySQL', education: 'Đại học Bách Khoa Đà Nẵng', location: 'Đà Nẵng', experience: 5 },
      { skills: 'Vue.js, Nuxt.js, Tailwind', education: 'Đại học FPT', location: 'Hà Nội', experience: 1 }
    ];

    for (let i = 0; i < candidates.length; i++) {
      await client.index({
        index: 'candidates',
        id: i + 1,
        document: candidates[i]
      });
    }
    console.log(`✅ Đã thêm ${candidates.length} ứng viên mẫu`);

    // 4. Tạo index jobs với mapping
    await client.indices.create({
      index: 'jobs',
      mappings: {
        properties: {
          title: { type: 'text' },
          location: { type: 'text' },
          description: { type: 'text' },
          skills_required: { type: 'text' }
        }
      }
    });
    console.log('✅ Đã tạo index "jobs"');

    // 5. Thêm dữ liệu mẫu cho jobs
    const jobs = [
      { title: 'Frontend Developer', location: 'Hà Nội', description: 'Xây dựng giao diện web với React', skills_required: 'React, JavaScript, CSS' },
      { title: 'Backend Developer', location: 'Hồ Chí Minh', description: 'Phát triển API với Node.js', skills_required: 'Node.js, Express, MongoDB' },
      { title: 'Fullstack Developer', location: 'Đà Nẵng', description: 'Làm cả frontend và backend', skills_required: 'React, Node.js, SQL' },
      { title: 'DevOps Engineer', location: 'Hà Nội', description: 'Quản lý CI/CD, Docker, Kubernetes', skills_required: 'Docker, Jenkins, AWS' },
      { title: 'UI/UX Designer', location: 'Hồ Chí Minh', description: 'Thiết kế trải nghiệm người dùng', skills_required: 'Figma, Adobe XD' }
    ];

    for (let i = 0; i < jobs.length; i++) {
      await client.index({
        index: 'jobs',
        id: i + 1,
        document: jobs[i]
      });
    }
    console.log(`✅ Đã thêm ${jobs.length} công việc mẫu`);

    console.log('🎉 Seed dữ liệu hoàn tất!');
  } catch (error) {
    console.error('❌ Lỗi khi seed:', error);
  }
}

// Chạy hàm seed
seed();
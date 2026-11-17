/**
 * SIPINTAR API — Automated Integration Test Suite
 * Executes comprehensive integration checks against the running server
 */

const BASE_URL = process.env.TEST_API_URL || 'http://localhost:5001/api/v1';

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const response = await fetch(url, options);
  let json = null;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    json = await response.json();
  }
  return { status: response.status, headers: response.headers, data: json };
}

let passed = 0;
let failed = 0;

function assert(condition, testName, errorDetails = '') {
  if (condition) {
    console.log(`  \x1b[32m✔ PASS\x1b[0m: ${testName}`);
    passed++;
  } else {
    console.error(`  \x1b[31m✖ FAIL\x1b[0m: ${testName} - ${errorDetails}`);
    failed++;
  }
}

async function runTests() {
  console.log(`\n============================================================`);
  console.log(`  SIPINTAR Sespimma REST API — Integration Test Runner`);
  console.log(`  Target URL: ${BASE_URL}`);
  console.log(`============================================================\n`);

  let adminToken = '';
  let serdikToken = '';

  // 1. Health Check
  try {
    const res = await request('/health');
    assert(res.status === 200 && res.data?.data?.status === 'healthy', '1. System Health Check (/health)');
  } catch (err) {
    assert(false, '1. System Health Check', err.message);
  }

  // 2. Admin Login
  try {
    const res = await request('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: 'dewi.susilo@sespimma.lemdiklat.polri.go.id',
        password: 'Password123!'
      })
    });
    adminToken = res.data?.data?.token || '';
    assert(res.status === 200 && adminToken.length > 20, '2. Admin Login with Email & Password (/auth/login)');
  } catch (err) {
    assert(false, '2. Admin Login', err.message);
  }

  // 3. Serdik Login
  try {
    const res = await request('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: '85071234',
        password: 'Password123!'
      })
    });
    serdikToken = res.data?.data?.token || '';
    assert(res.status === 200 && serdikToken.length > 20, '3. Serdik Login with NRP (/auth/login)');
  } catch (err) {
    assert(false, '3. Serdik Login', err.message);
  }

  // 4. Invalid Login Credentials (Expect 401)
  try {
    const res = await request('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: '80010001',
        password: 'WrongPassword'
      })
    });
    assert(res.status === 401 && res.data?.error?.code === 'UNAUTHORIZED', '4. Rejection of Invalid Password (401 UNAUTHORIZED)');
  } catch (err) {
    assert(false, '4. Invalid Credentials', err.message);
  }

  // 5. Get Current Profile (Me)
  try {
    const res = await request('/auth/me', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(res.status === 200 && res.data?.data?.role === 'admin', '5. Get Authenticated User Profile (/auth/me)');
  } catch (err) {
    assert(false, '5. Get Profile', err.message);
  }

  // 6. RBAC Admin Authorization
  try {
    const resAdmin = await request('/auth/admin-check', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const resSerdik = await request('/auth/admin-check', {
      headers: { Authorization: `Bearer ${serdikToken}` }
    });
    assert(resAdmin.status === 200 && resSerdik.status === 403, '6. RBAC Role Verification (Admin 200 vs Serdik 403)');
  } catch (err) {
    assert(false, '6. RBAC Check', err.message);
  }

  // 7. Categories & Subcategories
  try {
    const resCat = await request('/categories');
    const resSub = await request('/categories/2/subcategories');
    assert(
      resCat.status === 200 && resCat.data?.data?.length === 8 &&
      resSub.status === 200 && resSub.data?.data?.length > 0,
      '7. Category & Subcategory Taxonomy (/categories)'
    );
  } catch (err) {
    assert(false, '7. Categories', err.message);
  }

  // 8. Resources Catalog & Pagination
  try {
    const res = await request('/resources?page=1&limit=5');
    assert(
      res.status === 200 && Array.isArray(res.data?.data) && res.data?.meta?.total >= 100,
      '8. Resources Catalog & Pagination (/resources)'
    );
  } catch (err) {
    assert(false, '8. Resources Catalog', err.message);
  }

  // 9. Resource Detail
  try {
    const res = await request('/resources/1');
    assert(
      res.status === 200 && res.data?.data?.id === 1 && Array.isArray(res.data?.data?.tags),
      '9. Resource Detail & Attached Tags (/resources/:id)'
    );
  } catch (err) {
    assert(false, '9. Resource Detail', err.message);
  }

  // 10. Gadik List & Competencies
  try {
    const res = await request('/gadik?fungsional=true');
    assert(
      res.status === 200 && res.data?.meta?.total === 16 && res.data?.data[0]?.competencies?.length > 0,
      '10. Gadik Fungsional List & Competencies (/gadik)'
    );
  } catch (err) {
    assert(false, '10. Gadik List', err.message);
  }

  // 11. Library Categories & Books
  try {
    const resCat = await request('/library/categories');
    const resBooks = await request('/library/books?category_id=buku-fisik');
    assert(
      resCat.status === 200 && resCat.data?.data?.length === 4 &&
      resBooks.status === 200 && resBooks.data?.data?.length > 0,
      '11. Library Categories & Physical Book Catalogue (/library/books)'
    );
  } catch (err) {
    assert(false, '11. Library Catalogue', err.message);
  }

  // 12. Full-Text Unified Search
  try {
    const res = await request('/search?q=kepemimpinan&category=all');
    assert(
      res.status === 200 && res.data?.meta?.total > 0 && res.data?.data[0]?.score !== undefined,
      '12. Full-Text Unified Search with Relevance Score (/search)'
    );
  } catch (err) {
    assert(false, '12. Unified Search', err.message);
  }

  // 13. Security Guard: Metadata Saja Rejection (403 Forbidden)
  try {
    const res = await request('/library/books/9/preview');
    assert(
      res.status === 403 && res.data?.error?.code === 'FORBIDDEN',
      '13. Security Guard on "Metadata Saja" Documents (Strict 403 FORBIDDEN)'
    );
  } catch (err) {
    assert(false, '13. Metadata Saja Guard', err.message);
  }

  // 14. Document Streaming: Internal Document Access
  try {
    const resUnauth = await request('/resources/1/file');
    const resAuth = await request('/resources/1/file', {
      headers: { Authorization: `Bearer ${serdikToken}` }
    });
    assert(
      resUnauth.status === 401 && resAuth.status === 200 &&
      (resAuth.headers.get('content-type') || '').includes('application/pdf'),
      '14. Document File Streaming & Auth Gate (/resources/:id/file)'
    );
  } catch (err) {
    assert(false, '14. File Streaming', err.message);
  }

  // 15. Verification Queue (Bag Jarlat)
  try {
    const res = await request('/admin/verification/queue', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(res.status === 200 && Array.isArray(res.data?.data), '15. Verification Queue for Jarlat (/admin/verification/queue)');
  } catch (err) {
    assert(false, '15. Verification Queue', err.message);
  }

  // 16. Admin Monitoring Statistics
  try {
    const res = await request('/admin/monitoring/stats', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const overview = res.data?.data?.overview;
    assert(
      res.status === 200 && overview?.lifecycle && overview?.categories && overview?.users,
      '16. Monitoring Dashboard Aggregated Metrics (/admin/monitoring/stats)'
    );
  } catch (err) {
    assert(false, '16. Monitoring Stats', err.message);
  }

  // 17. User Account Management & Role Filtering
  try {
    const res = await request('/admin/users?role_code=serdik&limit=5', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(
      res.status === 200 && Array.isArray(res.data?.data) && res.data?.meta?.total > 0,
      '17. User Account Management & Role Filtering (/admin/users)'
    );
  } catch (err) {
    assert(false, '17. User Account Management', err.message);
  }

  // 18. Activity Audit Logs Trail
  try {
    const res = await request('/admin/monitoring/logs?type=activity&limit=5', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(
      res.status === 200 && Array.isArray(res.data?.data) && res.data?.data.length > 0,
      '18. Activity Audit Logs Trail (/admin/monitoring/logs)'
    );
  } catch (err) {
    assert(false, '18. Activity Audit Logs', err.message);
  }

  // 19. Taxonomy Tag Filtering on Catalog
  try {
    const res = await request('/resources?tag=Ketahanan%20Pangan');
    assert(
      res.status === 200 && res.data?.data?.length > 0 && res.data?.data[0]?.tags?.includes('Ketahanan Pangan'),
      '19. Dynamic Taxonomy Tag Filtering on Resources (/resources?tag=...)'
    );
  } catch (err) {
    assert(false, '19. Tag Filtering', err.message);
  }

  // 20. Self-Registration of Serdik Account
  try {
    const testNrp = `TEST${Date.now().toString().slice(-6)}`;
    const res = await request('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nama_lengkap: 'Serdik Uji Integrasi',
        email: `serdik.${testNrp}@serdik.polri.go.id`,
        password: 'Password123!',
        nrp_nip: testNrp,
        role_code: 'serdik',
        pangkat: 'KOMPOL',
        jabatan: 'Peserta Didik Sespimma 73',
        phone_number: '081299998888',
        nosis: `2026-73-${testNrp.slice(-3)}`,
        angkatan: 'Sespimma Angkatan 73 TA 2026'
      })
    });
    assert(
      res.status === 201 && res.data?.data?.user?.nrp_nip === testNrp,
      '20. Self-Registration of New Serdik Account (/auth/register)'
    );
  } catch (err) {
    assert(false, '20. Self-Registration', err.message);
  }

  // 21. Related Resources Recommendation Algorithm
  try {
    const res = await request('/resources/1/related?limit=4');
    assert(
      res.status === 200 && Array.isArray(res.data?.data),
      '21. Related Resources Recommendation Algorithm (/resources/:id/related)'
    );
  } catch (err) {
    assert(false, '21. Related Resources Recommendation', err.message);
  }

  // 22. Pimpinan Executive Oversight RBAC
  try {
    const loginRes = await request('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: '69080001',
        password: 'Password123!'
      })
    });
    const pimpinanToken = loginRes.data?.data?.token || '';
    const res = await request('/resources?status=Draft', {
      headers: { Authorization: `Bearer ${pimpinanToken}` }
    });
    const drafts = res.data?.data || [];
    assert(
      loginRes.status === 200 && res.status === 200 && drafts.every(d => d.lifecycle_status === 'Draft'),
      '22. Pimpinan Executive Oversight RBAC (Full Draft Audit Access)'
    );
  } catch (err) {
    assert(false, '22. Pimpinan Executive Oversight RBAC', err.message);
  }

  // 23. Detail Koleksi Buku Perpustakaan
  try {
    const res = await request('/library/books/1');
    assert(
      res.status === 200 && res.data?.data?.id === 1 && Boolean(res.data?.data?.title),
      '23. Detail Koleksi Buku & Eksemplar Perpustakaan (/library/books/:id)'
    );
  } catch (err) {
    assert(false, '23. Detail Koleksi Buku', err.message);
  }

  // 24. Siklus Tata Kelola Lengkap (Draft -> Review -> Archive)
  try {
    // A. Buat Draft
    const createRes = await request('/admin/resources', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        title: 'Materi Uji Integrasi Tata Kelola Otomatis',
        category_id: 2,
        author_or_instructor: 'Tim Otomasi Uji Sespimma',
        unit_or_source: 'Bag Jarlat Sespimma Lemdiklat Polri',
        description: 'Materi uji otomatis untuk memverifikasi mesin status siklus hidup',
        access_classification: 'Internal',
        tags: ['Uji Integrasi', 'Siklus Hidup']
      })
    });
    const createdId = createRes.data?.data?.id;

    // A2. Ubah Metadata Sumber Belajar (PUT)
    const updateRes = await request(`/admin/resources/${createdId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        title: 'Materi Uji Integrasi Tata Kelola Otomatis (Revisi)',
        category_id: 2,
        author_or_instructor: 'Tim Otomasi Uji Sespimma',
        description: 'Materi uji otomatis yang telah diperbarui metadatanya'
      })
    });

    // B. Verifikasi Review oleh Verifikator
    const loginVerif = await request('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: 'verifikator@sespimma.lemdiklat.polri.go.id',
        password: 'Password123!'
      })
    });
    const verifToken = loginVerif.data?.data?.token || '';

    const reviewRes = await request(`/admin/verification/${createdId}/review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${verifToken}`
      },
      body: JSON.stringify({
        decision: 'approve',
        notes: 'Disetujui secara otomatis melalui skenario uji integrasi.'
      })
    });

    // C. Arsipkan oleh Admin
    const archiveRes = await request(`/admin/resources/${createdId}/archive`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` }
    });

    // D. Bersihkan data uji dari basis data
    const pool = (await import('../src/config/db.js')).default;
    await pool.query('DELETE FROM resource_tags WHERE resource_id = ?', [createdId]);
    await pool.query('DELETE FROM verification_logs WHERE resource_id = ?', [createdId]);
    await pool.query('DELETE FROM resources WHERE id = ?', [createdId]);

    assert(
      createRes.status === 201 && updateRes.status === 200 && reviewRes.status === 200 && archiveRes.status === 200,
      '24. Siklus Tata Kelola Lengkap: Buat Draf, Ubah Metadata, Verifikasi & Arsip (/admin/resources)'
    );
  } catch (err) {
    assert(false, '24. Siklus Tata Kelola Lengkap', err.message);
  }

  // 25. Perlindungan Akses Sampel Buku Berklasifikasi "Metadata Saja"
  try {
    const res = await request('/library/books/9/preview');
    assert(
      res.status === 403 && res.data?.error?.code === 'FORBIDDEN',
      '25. Perlindungan Sampel Buku "Metadata Saja" (Strict 403 FORBIDDEN)'
    );
  } catch (err) {
    assert(false, '25. Perlindungan Sampel Metadata Saja', err.message);
  }

  // 26. User Status Management & Self-Deactivation Guard
  try {
    const meRes = await request('/auth/me', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const adminId = meRes.data?.data?.id;

    // A. Rejection of self-deactivation
    const selfRes = await request(`/admin/users/${adminId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({ is_active: false })
    });

    // B. Normal status toggle
    const toggleRes = await request('/admin/users/23/status', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({ is_active: true })
    });

    assert(
      selfRes.status === 400 && selfRes.data?.error?.code === 'INVALID_ACTION' && toggleRes.status === 200,
      '26. User Status Management & Self-Deactivation Guard (/admin/users/:id/status)'
    );
  } catch (err) {
    assert(false, '26. User Status Management', err.message);
  }

  // 27. User Role Updating & RBAC Assignment
  try {
    const res = await request('/admin/users/23/role', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({ role_code: 'serdik' })
    });
    assert(
      res.status === 200 && res.data?.data?.new_role === 'serdik',
      '27. User Role Updating & RBAC Assignment (/admin/users/:id/role)'
    );
  } catch (err) {
    assert(false, '27. User Role Updating', err.message);
  }

  // 28. Interactive Swagger UI & OpenAPI 3.0 Documentation Specification
  try {
    const openapiRes = await fetch('http://localhost:5001/openapi.json').then(r => r.json());
    const docsRes = await fetch('http://localhost:5001/docs').then(r => r.text());
    assert(
      openapiRes.openapi?.startsWith('3.0') &&
      Object.keys(openapiRes.paths || {}).length >= 27 &&
      docsRes.includes('SwaggerUIBundle'),
      '28. Interactive Swagger UI & OpenAPI 3.0 Documentation Specification (/docs & /openapi.json)'
    );
  } catch (err) {
    assert(false, '28. Interactive Swagger UI & OpenAPI 3.0 Specification', err.message);
  }

  console.log(`\n------------------------------------------------------------`);
  console.log(`  Test Summary: \x1b[32m${passed} Passed\x1b[0m, \x1b[31m${failed} Failed\x1b[0m out of ${passed + failed} Tests`);
  console.log(`------------------------------------------------------------\n`);

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests();


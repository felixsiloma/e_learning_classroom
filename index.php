<?php
/**
 * HYCLASS Studio Academy - Master PHP Web Application
 * Modern Architecture & Built Environment Academy
 * Includes JSON Database Engine, Render PostgreSQL connectivity, and responsive HTML/CSS UI
 */
require_once __DIR__ . '/database.php';

$settings = Database::get_settings();
$courses = Database::get_courses();
$users = Database::get_users();
$transactions = Database::get_transactions();
$admin_count = Database::count_admins();
$max_admins = MAX_ADMIN_COUNT;
$is_pg = Database::get_pdo() !== null;
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($settings['platformName'] ?? 'HYCLASS Studio Academy') ?> - Architecture & Built Environment</title>
    <meta name="description" content="<?= htmlspecialchars($settings['tagline'] ?? '') ?>">
    <link rel="stylesheet" href="/public/css/style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
    <style>
        .grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem; }
        .course-card { background: #fff; border-radius: 1.25rem; border: 1px solid var(--border-light); overflow: hidden; transition: transform 0.2s, box-shadow 0.2s; }
        .course-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px -10px rgba(0,33,71,0.15); }
        .badge { padding: 0.25rem 0.65rem; border-radius: 9999px; font-size: 0.6875rem; font-weight: 700; text-transform: uppercase; }
        .badge-gold { background: #fef3c7; color: #92400e; }
        .badge-blue { background: #e0f2fe; color: #0369a1; }
        .badge-green { background: #dcfce7; color: #166534; }
        .tab-btn { padding: 0.5rem 1rem; border-radius: 0.75rem; font-size: 0.8125rem; font-weight: 600; cursor: pointer; border: none; background: transparent; color: #93c5fd; transition: all 0.2s; }
        .tab-btn.active { background: #ffffff; color: var(--oxford-blue); font-weight: 800; }
        .portal-pane { display: none; }
        .portal-pane.active { display: block; }
    </style>
</head>
<body>

    <!-- Top Announcement Bar -->
    <div class="top-announcement">
        <span>✨ <?= htmlspecialchars($settings['announcementText'] ?? 'Term 1 Admissions Open · Accredited RIBA / BREEAM Studio Courses in Kenya Shillings') ?></span>
        <span style="opacity: 0.5;">|</span>
        <span style="color: #fbbf24; font-weight: 700;">Database: <?= $is_pg ? 'Render PostgreSQL (Connected)' : 'JSON Database Engine (Ready)' ?></span>
    </div>

    <!-- Website Header -->
    <header class="site-header">
        <div class="header-container">
            <div class="brand-badge" onclick="switchPortal('landing')">
                <div class="hs-matrix-scanner">
                    <div class="hs-matrix-pulse"></div>
                    <div class="hs-matrix-beam"></div>
                    <div class="brand-emblem">HS</div>
                </div>
                <div>
                    <div style="font-size: 1.05rem; font-weight: 800; line-height: 1; display: flex; align-items: center; gap: 0.35rem;">
                        <span><?= htmlspecialchars($settings['platformName'] ?? 'HYCLASS Studio') ?></span>
                        <span style="background: #fbbf24; color: #002147; font-size: 0.55rem; padding: 0.15rem 0.35rem; border-radius: 0.25rem; font-weight: 900;">ACADEMY</span>
                    </div>
                    <div style="font-size: 0.65rem; color: #93c5fd; margin-top: 0.2rem;">
                        <?= htmlspecialchars($settings['tagline'] ?? 'Oxford Academy of Architecture') ?>
                    </div>
                </div>
            </div>

            <!-- Role Portal Tabs -->
            <div style="display: flex; background: #072c59; padding: 0.25rem; border-radius: 1rem; border: 1px solid rgba(56,189,248,0.2);">
                <button class="tab-btn active" onclick="switchPortal('landing', this)">Catalog & Overview</button>
                <button class="tab-btn" onclick="switchPortal('student', this)">Student Desk</button>
                <button class="tab-btn" onclick="switchPortal('instructor', this)">Faculty Studio</button>
                <button class="tab-btn" onclick="switchPortal('admin', this)">Admin Console</button>
            </div>

            <!-- Auth Buttons & Matrix Button -->
            <div style="display: flex; gap: 0.5rem; align-items: center;">
                <button class="btn btn-outline" onclick="openModal('modal-matrix-reset')">Matrix Reset</button>
                <button class="btn btn-outline" onclick="openModal('modal-login')">Sign In</button>
                <button class="btn btn-gold" onclick="openModal('modal-register')">Register</button>
            </div>
        </div>
    </header>

    <!-- Main Content Area -->
    <main class="container" style="padding-top: 2rem; padding-bottom: 4rem;">

        <!-- 1. LANDING & CATALOG PANE -->
        <section id="pane-landing" class="portal-pane active">
            <!-- Hero Banner -->
            <div style="background: linear-gradient(135deg, #002147 0%, #031d3d 100%); color: #fff; padding: 3.5rem 2rem; border-radius: 2rem; margin-bottom: 3rem; border: 1px solid #0a2e5c; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);">
                <div style="max-width: 48rem;">
                    <div class="badge badge-gold" style="margin-bottom: 1rem; display: inline-block;">
                        Accredited Architectural Curriculum
                    </div>
                    <h1 style="font-size: 2.5rem; font-weight: 800; line-height: 1.15; margin-bottom: 1rem;">
                        <?= htmlspecialchars($settings['frontPageHeroTitle'] ?? 'Pioneering Sustainable Architecture') ?>
                    </h1>
                    <p style="font-size: 1rem; color: #bae6fd; line-height: 1.6; margin-bottom: 1.5rem;">
                        <?= htmlspecialchars($settings['frontPageHeroSubtitle'] ?? 'Master mass-timber structural engineering, bioclimatic modeling, and parametric BIM in Kenya Shillings.') ?>
                    </p>
                    <div style="display: flex; gap: 0.75rem;">
                        <button class="btn btn-gold" onclick="switchPortal('student')">Explore Studio Courses (KES)</button>
                        <button class="btn btn-outline" onclick="openModal('modal-login')">Access Student Desk</button>
                    </div>
                </div>
            </div>

            <!-- Course Catalog Grid -->
            <div style="margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h2 style="font-size: 1.5rem; font-weight: 800; color: var(--oxford-blue);">Architectural Studio Curricula</h2>
                    <p style="font-size: 0.8125rem; color: var(--text-muted);">Enroll with Kenya Shillings (KES) M-Pesa STK push or Card</p>
                </div>
                <span class="badge badge-blue"><?= count($courses) ?> Published Courses</span>
            </div>

            <div class="grid-3">
                <?php foreach ($courses as $c): ?>
                    <div class="course-card">
                        <div style="height: 11rem; background: #002147; position: relative; overflow: hidden;">
                            <img src="<?= htmlspecialchars($c['thumbnail'] ?? '') ?>" alt="<?= htmlspecialchars($c['title']) ?>" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.85;" onerror="this.src='https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=600&q=80'">
                            <span class="badge badge-gold" style="position: absolute; top: 0.75rem; left: 0.75rem;">
                                <?= htmlspecialchars($c['level'] ?? 'Intermediate') ?>
                            </span>
                        </div>
                        <div style="padding: 1.25rem;">
                            <div style="font-size: 0.6875rem; color: var(--text-muted); font-weight: 700; margin-bottom: 0.35rem;">
                                <?= htmlspecialchars($c['category'] ?? 'Architecture & Built Environment') ?>
                            </div>
                            <h3 style="font-size: 1.05rem; font-weight: 700; color: var(--oxford-blue); margin-bottom: 0.5rem; line-height: 1.3;">
                                <?= htmlspecialchars($c['title']) ?>
                            </h3>
                            <p style="font-size: 0.75rem; color: #475569; line-height: 1.5; margin-bottom: 1rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                                <?= htmlspecialchars($c['subtitle'] ?? '') ?>
                            </p>
                            <div style="border-top: 1px solid var(--border-light); padding-top: 0.75rem; display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <div style="font-size: 0.65rem; color: var(--text-muted);">Studio Tuition</div>
                                    <div style="font-size: 1.15rem; font-weight: 800; color: var(--oxford-blue); font-family: monospace;">
                                        KES <?= number_format($c['price'] ?? 4900) ?>
                                    </div>
                                </div>
                                <button class="btn btn-primary" onclick="openEnroll('<?= htmlspecialchars($c['id']) ?>', '<?= htmlspecialchars(addslashes($c['title'])) ?>', <?= (int)($c['price'] ?? 4900) ?>)">
                                    Enroll (M-Pesa)
                                </button>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </section>

        <!-- 2. STUDENT DESK PANE -->
        <section id="pane-student" class="portal-pane">
            <div style="background: #ffffff; border-radius: 1.5rem; border: 1px solid var(--border-light); padding: 1.5rem; margin-bottom: 2rem;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h2 style="font-size: 1.35rem; font-weight: 800; color: var(--oxford-blue);">Student Learning Workspace</h2>
                        <p style="font-size: 0.8125rem; color: var(--text-muted);">Scholarly progress, active video lectures, and certificates</p>
                    </div>
                    <button class="btn btn-gold" onclick="openPlayer()">Launch Studio Classroom Player</button>
                </div>
            </div>

            <div class="grid-3">
                <div style="background: #ffffff; padding: 1.5rem; border-radius: 1.25rem; border: 1px solid var(--border-light);">
                    <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 0.5rem;">Mass-Timber Structural Engineering</h4>
                    <p style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 1rem;">Progress: 3 of 4 lessons completed (75%)</p>
                    <div style="background: #e2e8f0; height: 8px; border-radius: 4px; overflow: hidden; margin-bottom: 1rem;">
                        <div style="background: #002147; width: 75%; height: 100%;"></div>
                    </div>
                    <button class="btn btn-primary" style="width: 100%;" onclick="openPlayer()">Continue Module 1</button>
                </div>

                <div style="background: #ffffff; padding: 1.5rem; border-radius: 1.25rem; border: 1px solid var(--border-light);">
                    <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 0.5rem;">Verified Certificate Registry</h4>
                    <p style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 1rem;">Issued by Oxford School of Architecture & Built Environment</p>
                    <button class="btn btn-gold" style="width: 100%;" onclick="openModal('modal-certificate')">View Diploma Certificate</button>
                </div>
            </div>
        </section>

        <!-- 3. INSTRUCTOR DESK PANE -->
        <section id="pane-instructor" class="portal-pane">
            <div style="background: #ffffff; border-radius: 1.5rem; border: 1px solid var(--border-light); padding: 1.5rem; margin-bottom: 2rem;">
                <h2 style="font-size: 1.35rem; font-weight: 800; color: var(--oxford-blue);">Faculty Studio & Curricula Desk</h2>
                <p style="font-size: 0.8125rem; color: var(--text-muted);">Royalties: 85% revenue share paid directly via Kenyan M-Pesa</p>
            </div>

            <div style="background: #fff; padding: 1.5rem; border-radius: 1.25rem; border: 1px solid var(--border-light); max-width: 40rem;">
                <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 1rem; color: var(--oxford-blue);">Publish New Architectural Studio Course</h3>
                <form onsubmit="handleCreateCourse(event)">
                    <div style="margin-bottom: 1rem;">
                        <label style="display: block; font-size: 0.75rem; font-weight: 700; margin-bottom: 0.25rem;">Course Title</label>
                        <input type="text" id="course-title" required placeholder="e.g. Bioclimatic Parametric Skyscrapers" style="width: 100%; padding: 0.65rem; border: 1px solid var(--border-light); border-radius: 0.75rem; font-size: 0.8125rem;">
                    </div>
                    <div style="margin-bottom: 1rem; display: flex; gap: 1rem;">
                        <div style="flex: 1;">
                            <label style="display: block; font-size: 0.75rem; font-weight: 700; margin-bottom: 0.25rem;">Tuition (KES)</label>
                            <input type="number" id="course-price" required value="5500" style="width: 100%; padding: 0.65rem; border: 1px solid var(--border-light); border-radius: 0.75rem; font-size: 0.8125rem; font-family: monospace;">
                        </div>
                        <div style="flex: 1;">
                            <label style="display: block; font-size: 0.75rem; font-weight: 700; margin-bottom: 0.25rem;">Studio Level</label>
                            <select id="course-level" style="width: 100%; padding: 0.65rem; border: 1px solid var(--border-light); border-radius: 0.75rem; font-size: 0.8125rem;">
                                <option>Beginner</option>
                                <option selected>Intermediate</option>
                                <option>Advanced</option>
                            </select>
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%;">Save to JSON Database</button>
                </form>
            </div>
        </section>

        <!-- 4. ADMIN CONSOLE PANE -->
        <section id="pane-admin" class="portal-pane">
            <div style="background: var(--oxford-blue); color: #fff; border-radius: 1.5rem; padding: 2rem; margin-bottom: 2rem;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div class="badge badge-gold" style="margin-bottom: 0.5rem; display: inline-block;">Master Governance Console</div>
                        <h2 style="font-size: 1.5rem; font-weight: 800;">Administrator Authority Desk</h2>
                        <p style="font-size: 0.8125rem; color: #bae6fd;">Strict 2-Admin Quota enforcement, password priority override, and JSON/Render database inspector</p>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 0.75rem; color: #bae6fd;">Admin Quota Status</div>
                        <div style="font-size: 1.5rem; font-weight: 800; font-family: monospace; color: #fbbf24;">
                            <?= $admin_count ?> / <?= $max_admins ?> Registered
                        </div>
                    </div>
                </div>
            </div>

            <!-- Users Management Table with Priority Password Override -->
            <div style="background: #fff; border-radius: 1.25rem; border: 1px solid var(--border-light); padding: 1.5rem; margin-bottom: 2rem;">
                <h3 style="font-size: 1.1rem; font-weight: 800; color: var(--oxford-blue); margin-bottom: 1rem;">Platform Registered Users (JSON Database)</h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 0.8125rem;">
                    <thead>
                        <tr style="border-bottom: 2px solid var(--border-light); text-align: left; color: var(--text-muted);">
                            <th style="padding: 0.75rem 0.5rem;">User</th>
                            <th style="padding: 0.75rem 0.5rem;">Email</th>
                            <th style="padding: 0.75rem 0.5rem;">Role</th>
                            <th style="padding: 0.75rem 0.5rem;">Status</th>
                            <th style="padding: 0.75rem 0.5rem; text-align: right;">Admin Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($users as $u): ?>
                            <tr style="border-bottom: 1px solid var(--border-light);">
                                <td style="padding: 0.75rem 0.5rem; font-weight: 700;"><?= htmlspecialchars($u['name']) ?></td>
                                <td style="padding: 0.75rem 0.5rem; font-family: monospace; color: var(--text-muted);"><?= htmlspecialchars($u['email']) ?></td>
                                <td style="padding: 0.75rem 0.5rem;">
                                    <span class="badge <?= $u['role'] === 'admin' ? 'badge-gold' : ($u['role'] === 'instructor' ? 'badge-blue' : 'badge-green') ?>">
                                        <?= htmlspecialchars(strtoupper($u['role'])) ?>
                                    </span>
                                </td>
                                <td style="padding: 0.75rem 0.5rem;"><?= htmlspecialchars($u['status'] ?? 'active') ?></td>
                                <td style="padding: 0.75rem 0.5rem; text-align: right;">
                                    <button class="btn btn-gold" style="padding: 0.3rem 0.65rem; font-size: 0.7rem;" onclick="openAdminReset('<?= htmlspecialchars($u['id']) ?>', '<?= htmlspecialchars(addslashes($u['name'])) ?>')">
                                        Reset Password
                                    </button>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </section>

    </main>

    <!-- MODAL: LOGIN WITH HS SCANNING ANIMATION -->
    <div id="modal-login" class="modal-overlay" style="display: none;">
        <div class="modal-card">
            <div class="modal-header">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <div class="hs-matrix-scanner" style="width: 2.25rem; height: 2.25rem;">
                        <div class="hs-matrix-pulse"></div>
                        <div class="hs-matrix-beam"></div>
                        <div class="brand-emblem" style="width: 2.25rem; height: 2.25rem; font-size: 0.9rem;">HS</div>
                    </div>
                    <div>
                        <div style="font-weight: 800; font-size: 1rem;">Studio Sign In</div>
                        <div style="font-size: 0.65rem; color: #93c5fd;">High-Class Studio (HS) Authentication</div>
                    </div>
                </div>
                <button onclick="closeModal('modal-login')" style="background: none; border: none; color: #fff; cursor: pointer; font-size: 1.25rem;">✕</button>
            </div>
            <div class="modal-body">
                <div id="login-alert" class="alert-error" style="display: none;"></div>
                <form onsubmit="handleLogin(event)">
                    <div style="margin-bottom: 1rem;">
                        <label style="display: block; font-size: 0.75rem; font-weight: 700; margin-bottom: 0.25rem;">Email Address</label>
                        <input type="email" id="login-email" required value="felixsiloma@gmail.com" style="width: 100%; padding: 0.65rem; border: 1px solid var(--border-light); border-radius: 0.75rem; font-size: 0.8125rem;">
                    </div>
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; font-size: 0.75rem; font-weight: 700; margin-bottom: 0.25rem;">Password</label>
                        <input type="password" id="login-password" required value="password123" style="width: 100%; padding: 0.65rem; border: 1px solid var(--border-light); border-radius: 0.75rem; font-size: 0.8125rem;">
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%; margin-bottom: 0.75rem;">Authenticate Account</button>
                    <div style="display: flex; justify-content: space-between; font-size: 0.75rem;">
                        <a href="javascript:void(0)" onclick="closeModal('modal-login'); openModal('modal-matrix-reset');" style="color: #0369a1; font-weight: 700;">Forgot Password Matrix?</a>
                        <a href="javascript:void(0)" onclick="closeModal('modal-login'); openModal('modal-register');" style="color: var(--oxford-blue); font-weight: 700;">Register as Student</a>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- MODAL: FORGOT PASSWORD MATRIX BUTTON -->
    <div id="modal-matrix-reset" class="modal-overlay" style="display: none;">
        <div class="modal-card">
            <div class="modal-header">
                <div>
                    <div style="font-weight: 800; font-size: 1rem;">Password Matrix Self-Service Reset</div>
                    <div style="font-size: 0.65rem; color: #93c5fd;">Instant verification with registered email</div>
                </div>
                <button onclick="closeModal('modal-matrix-reset')" style="background: none; border: none; color: #fff; cursor: pointer; font-size: 1.25rem;">✕</button>
            </div>
            <div class="modal-body">
                <div id="matrix-alert" class="alert-success" style="display: none;"></div>
                <form onsubmit="handleMatrixReset(event)">
                    <div style="margin-bottom: 1rem;">
                        <label style="display: block; font-size: 0.75rem; font-weight: 700; margin-bottom: 0.25rem;">Registered Email</label>
                        <input type="email" id="matrix-email" required placeholder="your.name@hyclass.oxford.ac.uk" style="width: 100%; padding: 0.65rem; border: 1px solid var(--border-light); border-radius: 0.75rem; font-size: 0.8125rem;">
                    </div>
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; font-size: 0.75rem; font-weight: 700; margin-bottom: 0.25rem;">New Password</label>
                        <input type="password" id="matrix-new-pwd" required minlength="6" placeholder="Minimum 6 characters" style="width: 100%; padding: 0.65rem; border: 1px solid var(--border-light); border-radius: 0.75rem; font-size: 0.8125rem;">
                    </div>
                    <button type="submit" class="btn btn-gold" style="width: 100%;">Confirm Password Reset Matrix</button>
                </form>
            </div>
        </div>
    </div>

    <!-- MODAL: ADMIN PRIORITY PASSWORD OVERRIDE -->
    <div id="modal-admin-reset" class="modal-overlay" style="display: none;">
        <div class="modal-card">
            <div class="modal-header">
                <div>
                    <div style="font-weight: 800; font-size: 1rem;">Admin Priority Password Override</div>
                    <div style="font-size: 0.65rem; color: #fef08a;">Master Governance Authorization</div>
                </div>
                <button onclick="closeModal('modal-admin-reset')" style="background: none; border: none; color: #fff; cursor: pointer; font-size: 1.25rem;">✕</button>
            </div>
            <div class="modal-body">
                <div id="admin-reset-alert" class="alert-success" style="display: none;"></div>
                <input type="hidden" id="admin-target-user-id">
                <div style="margin-bottom: 1rem;">
                    <div style="font-size: 0.8125rem; font-weight: 700;">Target User: <span id="admin-target-name" style="color: var(--oxford-blue);"></span></div>
                </div>
                <div style="margin-bottom: 1.5rem;">
                    <label style="display: block; font-size: 0.75rem; font-weight: 700; margin-bottom: 0.25rem;">Assign New Password</label>
                    <input type="text" id="admin-assigned-pwd" required value="HYCLASS#2026!" style="width: 100%; padding: 0.65rem; border: 1px solid var(--border-light); border-radius: 0.75rem; font-size: 0.8125rem; font-family: monospace;">
                </div>
                <button type="button" class="btn btn-primary" style="width: 100%;" onclick="executeAdminPasswordReset()">Override User Password</button>
            </div>
        </div>
    </div>

    <!-- MODAL: REGISTRATION WITH 2-ADMIN RULE -->
    <div id="modal-register" class="modal-overlay" style="display: none;">
        <div class="modal-card">
            <div class="modal-header">
                <div>
                    <div style="font-weight: 800; font-size: 1rem;">Register Account</div>
                    <div style="font-size: 0.65rem; color: #93c5fd;">Strict 2-Admin quota enforced</div>
                </div>
                <button onclick="closeModal('modal-register')" style="background: none; border: none; color: #fff; cursor: pointer; font-size: 1.25rem;">✕</button>
            </div>
            <div class="modal-body">
                <div id="register-alert" class="alert-error" style="display: none;"></div>
                <form onsubmit="handleRegister(event)">
                    <div style="margin-bottom: 1rem;">
                        <label style="display: block; font-size: 0.75rem; font-weight: 700; margin-bottom: 0.25rem;">Full Name</label>
                        <input type="text" id="reg-name" required placeholder="Arch. Jane Doe" style="width: 100%; padding: 0.65rem; border: 1px solid var(--border-light); border-radius: 0.75rem; font-size: 0.8125rem;">
                    </div>
                    <div style="margin-bottom: 1rem;">
                        <label style="display: block; font-size: 0.75rem; font-weight: 700; margin-bottom: 0.25rem;">Email Address</label>
                        <input type="email" id="reg-email" required placeholder="jane.doe@hyclass.oxford.ac.uk" style="width: 100%; padding: 0.65rem; border: 1px solid var(--border-light); border-radius: 0.75rem; font-size: 0.8125rem;">
                    </div>
                    <div style="margin-bottom: 1rem;">
                        <label style="display: block; font-size: 0.75rem; font-weight: 700; margin-bottom: 0.25rem;">Account Role</label>
                        <select id="reg-role" style="width: 100%; padding: 0.65rem; border: 1px solid var(--border-light); border-radius: 0.75rem; font-size: 0.8125rem;">
                            <option value="student">Student (Scholar)</option>
                            <option value="instructor">Instructor (Lecturer)</option>
                            <option value="admin" <?= $admin_count >= $max_admins ? 'disabled' : '' ?>>
                                Administrator <?= $admin_count >= $max_admins ? '(2-Admin Quota Full)' : '' ?>
                            </option>
                        </select>
                    </div>
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; font-size: 0.75rem; font-weight: 700; margin-bottom: 0.25rem;">Password</label>
                        <input type="password" id="reg-pwd" required minlength="6" value="password123" style="width: 100%; padding: 0.65rem; border: 1px solid var(--border-light); border-radius: 0.75rem; font-size: 0.8125rem;">
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%;">Create Account</button>
                </form>
            </div>
        </div>
    </div>

    <!-- MODAL: DIPLOMA CERTIFICATE -->
    <div id="modal-certificate" class="modal-overlay" style="display: none;">
        <div class="modal-card" style="max-width: 40rem;">
            <div class="modal-header">
                <div>
                    <div style="font-weight: 800; font-size: 1rem;">Verified Architectural Diploma Certificate</div>
                    <div style="font-size: 0.65rem; color: #93c5fd;">Oxford School of Architecture & Built Environment</div>
                </div>
                <button onclick="closeModal('modal-certificate')" style="background: none; border: none; color: #fff; cursor: pointer; font-size: 1.25rem;">✕</button>
            </div>
            <div class="modal-body" style="text-align: center; padding: 2.5rem 1.5rem; background: #faf8f5; border: 8px solid #002147; border-radius: 1rem; margin: 1rem;">
                <div style="font-family: serif; font-size: 1.8rem; font-weight: 800; color: #002147; margin-bottom: 0.5rem;">HYCLASS STUDIO ACADEMY</div>
                <div style="font-size: 0.8rem; color: #78350f; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 1.5rem;">Diploma of Architectural Excellence</div>
                <div style="font-size: 0.85rem; color: #4b5563; margin-bottom: 0.5rem;">This certifies that</div>
                <div style="font-size: 1.6rem; font-weight: 800; color: #002147; margin-bottom: 0.5rem; font-family: serif;">Felix Siloma</div>
                <div style="font-size: 0.85rem; color: #4b5563; max-width: 28rem; margin: 0 auto 1.5rem;">has successfully completed all studio critiques, thermal simulations, and structural drawings for</div>
                <div style="font-size: 1.15rem; font-weight: 700; color: #002147; margin-bottom: 1.5rem;">Sustainable Mass-Timber Architecture & Built Environment</div>
                <div style="display: flex; justify-content: space-around; font-size: 0.75rem; border-top: 1px solid #d1d5db; padding-top: 1rem;">
                    <div><strong>Dr. Sarah Lin</strong><br><span style="color: #6b7280;">Dean of Academic Governance</span></div>
                    <div><strong>Prof. Julian Sterling, RIBA</strong><br><span style="color: #6b7280;">Studio Chair</span></div>
                </div>
            </div>
        </div>
    </div>

    <!-- Website Footer -->
    <footer style="background: var(--oxford-dark); color: #fff; padding: 3rem 1rem 1.5rem; margin-top: 4rem; border-top: 1px solid #072c59; font-size: 0.75rem;">
        <div class="container" style="display: flex; justify-content: space-between; flex-wrap: gap; margin-bottom: 2rem;">
            <div>
                <div style="font-size: 1.1rem; font-weight: 800;"><?= htmlspecialchars($settings['platformName'] ?? 'HYCLASS Studio Academy') ?></div>
                <div style="color: #93c5fd; margin-top: 0.25rem;">Oxford School of Architecture & Built Environment</div>
                <p style="color: #64748b; max-width: 24rem; margin-top: 0.5rem; font-size: 0.75rem;">
                    Accredited studio curricula in Mass Timber, Bioclimatic Design, and Parametric BIM. Enforcing 2-Admin Governance and Render Free Cloud Deployment.
                </p>
            </div>
            <div>
                <div style="font-weight: 700; color: #fbbf24; margin-bottom: 0.5rem;">System Specifications</div>
                <div style="color: #94a3b8;">PHP REST API &amp; JSON Engine</div>
                <div style="color: #94a3b8;">Render PostgreSQL: <?= $is_pg ? 'Active' : 'Configured' ?></div>
                <div style="color: #94a3b8;">Currency: Kenya Shillings (KES)</div>
            </div>
        </div>
        <div class="container" style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1rem; color: #64748b; text-align: center;">
            © <?= date('Y') ?> HYCLASS Studio Academy. Built with HTML, CSS, JSON, and PHP. All rights reserved.
        </div>
    </footer>

    <!-- Interactive Vanilla JS Client Application -->
    <script>
        function switchPortal(portalId, btn) {
            document.querySelectorAll('.portal-pane').forEach(el => el.classList.remove('active'));
            document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
            const target = document.getElementById('pane-' + portalId);
            if (target) target.classList.add('active');
            if (btn) btn.classList.add('active');
        }

        function openModal(id) {
            const el = document.getElementById(id);
            if (el) el.style.display = 'flex';
        }

        function closeModal(id) {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
        }

        function openAdminReset(userId, userName) {
            document.getElementById('admin-target-user-id').value = userId;
            document.getElementById('admin-target-name').innerText = userName;
            openModal('modal-admin-reset');
        }

        async function handleLogin(e) {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const pwd = document.getElementById('login-password').value;
            const alertBox = document.getElementById('login-alert');

            try {
                const res = await fetch('/api/users.php');
                const data = await res.json();
                const user = (data.users || []).find(u => u.email.toLowerCase() === email.toLowerCase());

                if (!user) {
                    alertBox.innerText = 'Authentication error: Email address not recognized in HYCLASS Studio Academy.';
                    alertBox.style.display = 'block';
                    return;
                }
                if (user.password && user.password !== pwd) {
                    alertBox.innerText = 'Authentication error: Incorrect password entered for ' + user.email;
                    alertBox.style.display = 'block';
                    return;
                }

                alertBox.style.display = 'none';
                closeModal('modal-login');
                if (user.role === 'admin') switchPortal('admin');
                else if (user.role === 'instructor') switchPortal('instructor');
                else switchPortal('student');
            } catch (err) {
                alertBox.innerText = 'Network response: ' + err.message;
                alertBox.style.display = 'block';
            }
        }

        async function handleMatrixReset(e) {
            e.preventDefault();
            const email = document.getElementById('matrix-email').value;
            const newPassword = document.getElementById('matrix-new-pwd').value;
            const alertBox = document.getElementById('matrix-alert');

            const res = await fetch('/api/reset_password.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, newPassword })
            });
            const result = await res.json();

            alertBox.innerText = result.message;
            alertBox.style.display = 'block';
            if (result.success) {
                setTimeout(() => closeModal('modal-matrix-reset'), 2000);
            }
        }

        async function executeAdminPasswordReset() {
            const userId = document.getElementById('admin-target-user-id').value;
            const newPassword = document.getElementById('admin-assigned-pwd').value;
            const alertBox = document.getElementById('admin-reset-alert');

            const res = await fetch('/api/reset_password.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, newPassword, adminInitiated: true })
            });
            const result = await res.json();

            alertBox.innerText = result.message;
            alertBox.style.display = 'block';
            setTimeout(() => {
                closeModal('modal-admin-reset');
                location.reload();
            }, 1800);
        }

        async function handleRegister(e) {
            e.preventDefault();
            const name = document.getElementById('reg-name').value;
            const email = document.getElementById('reg-email').value;
            const role = document.getElementById('reg-role').value;
            const password = document.getElementById('reg-pwd').value;
            const alertBox = document.getElementById('register-alert');

            const res = await fetch('/api/users.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, role, password })
            });
            const result = await res.json();

            if (!result.success) {
                alertBox.innerText = result.message;
                alertBox.style.display = 'block';
            } else {
                alertBox.style.display = 'none';
                closeModal('modal-register');
                location.reload();
            }
        }

        function openEnroll(courseId, courseTitle, amount) {
            const phone = prompt('Enter M-Pesa phone number for KES ' + amount.toLocaleString() + ' tuition:');
            if (phone) {
                fetch('/api/transactions.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ courseId, courseTitle, amount, paymentMethod: 'mpesa', paymentDetails: { phone } })
                }).then(() => {
                    alert('M-Pesa STK push completed! Receipt generated.');
                    switchPortal('student');
                });
            }
        }

        function openPlayer() {
            alert('Classroom player: Playing Module 1.1 "Designing with Climate, Sun and Wind"');
        }
    </script>
</body>
</html>

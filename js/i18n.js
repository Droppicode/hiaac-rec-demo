/* =============================================================================
   HIAAC-Rec Internationalization Engine (i18n.js)
   Bilingual Support: English (Default) & Português (PT-BR)
   ============================================================================= */

const I18N_TRANSLATIONS = {
  en: {
    // Navigation
    "nav.brandSub": "Research Presentation",
    "nav.overview": "Overview",
    "nav.demo": "Interactive Demo",
    "nav.arch": "Architecture",
    "nav.validation": "Validation",
    "nav.code": "Paper & Code",
    "nav.demoBtn": "Interactive Demo ▾",
    "nav.themeTitle": "Toggle Light/Dark Theme",
    "nav.langTitle": "Switch Language / Mudar Idioma",

    // Hero Section
    "hero.badge": "Research Paper Presentation • Open-Source Academic Toolkit",
    "hero.titleHighlight": "HIAAC-Rec:",
    "hero.titleRest": "An Open-Source Toolkit for Synchronized Multimodal Data Collection, Annotation, and Face Anonymization",
    "hero.affil1": "Hub for Artificial Intelligence and Cognitive Architectures (H.IAAC), Campinas, Brazil",
    "hero.affil2": "University of Campinas (UNICAMP), Campinas, Brazil",
    "hero.affil3": "Instituto de Pesquisas Eldorado, Campinas, Brazil",
    "hero.corrAuthor": "*Corresponding author: borin@unicamp.br",
    "hero.abstractTag": "ABSTRACT",
    "hero.abstractText": "This work presents <strong>HIAAC-Rec</strong>, an open-source toolkit for building high-quality multimodal datasets for Human Activity Recognition (HAR). Unlike prior work, which mostly releases only the collected dataset or lightweight pre-processing scripts, the proposed toolkit integrates, in a single pipeline: a smartphone-based data acquisition application, a server-side backend for data synchronization and processing, a face-masking anonymization application, an interactive time-series labeling interface, and a multi-annotator visualization interface. The toolkit was validated with six smartphones producing 45 sensor channels at 10 and 100 Hz alongside 30 fps video. Experiments demonstrate an inter-device lag below half a sampling period (largest absolute mean lag of <strong>3.75 ms</strong> with no relative drift), and face anonymization achieving <strong>94.59% automatic masking coverage</strong>, reaching full agreement through manual auditing across 25 annotated videos.",
    "hero.btnDemo": "⚡ Launch Interactive Demo",
    "hero.btnVal": "📊 Empirical Validation",
    "hero.btnCode": "📄 Paper & Code",

    // Interactive Demo Launcher Card
    "launcher.tag": "INTERACTIVE DEMO",
    "launcher.title": "End-to-End Multimodal Pipeline",
    "launcher.subtitle": "Session: eval [all] [02] • Evaluated activities: VERTICAL and HORIZONTAL • Annotators: lab 1, lab 2, and lab 3. Experience the complete workflow from mobile sensor collection to face anonymization, ends-at labeling, and multi-annotator consensus.",
    "launcher.sessionBadge": "Session: eval [all] [02] • Subject 02 (eval) • 100 Hz",
    "launcher.clickHint": "Click to Open Fullscreen Demo",
    "launcher.step1": "Mobile App",
    "launcher.step2": "Masking Studio",
    "launcher.step3": "Labeler",
    "launcher.step4": "Viewer",
    "launcher.desc": "Launch the near-fullscreen interactive simulation running on real 100 Hz inertial streams and synchronized camera video from evaluation session <code>eval [all] [02]</code>. Test face anonymization styles (blur, pixelate, solid), mark activity initiation (-1) and termination on the waveform, and compute multi-annotator consensus.",
    "launcher.playBtn": "▶ Play Interactive Demo",
    "launcher.btnText": "🚀 Launch Interactive Demo",

    // Demo Modal - Steps & Controls
    "modal.close": "✕ Close",
    "modal.step1Num": "Step 01",
    "modal.step1Title": "HIAAC-Rec-App",
    "modal.step2Num": "Step 02",
    "modal.step2Title": "Masking Studio",
    "modal.step3Num": "Step 03",
    "modal.step3Title": "HIAAC-Rec-Labeler",
    "modal.step4Num": "Step 04",
    "modal.step4Title": "HIAAC-Rec-Viewer",
    "modal.tourToggle": "Guided Tour",

    // Demo Intro Overlay Modal
    "intro.sessionBadge": "🎯 Test Session: eval [all] [02]",
    "intro.title": "HIAAC-Rec Interactive Demonstration",
    "intro.desc": "You are about to experience the complete multimodal pipeline of the toolkit using a real validation recording session. The walkthrough covers each phase of the research data lifecycle:",
    "intro.step1Title": "Mobile Collection",
    "intro.step1Sub": "App • 100 Hz",
    "intro.step2Title": "Masking",
    "intro.step2Sub": "Face Anonymization",
    "intro.step3Title": "Labeler",
    "intro.step3Sub": "Ends-at Labeling",
    "intro.step4Title": "Viewer",
    "intro.step4Sub": "Consensus & Export",
    "intro.hint": "💡 Follow the interactive spotlight guide that highlights the next action if you hesitate.",
    "intro.startBtn": "Start Demonstration ➜",

    // Guide Bar Messages
    "guide.step1Initial": "<strong>Step 1: Mobile Acquisition</strong> — Click <strong>[● Start Recording]</strong> on the smartphone to sample inertial sensors at 100 Hz and capture camera video.",
    "guide.step1Recording": "<strong>Recording Active</strong> — Sensors sampling at 100 Hz synchronized with camera. Notice the <em>Vertical</em> and <em>Horizontal</em> movements before finishing.",
    "guide.step1Stopped": "<strong>Acquisition Complete</strong> — Session buffered locally. Click <strong>[☁ Send to Server]</strong> to upload data and trigger synchronization.",
    "guide.step2": "<strong>Step 2: Face Masking Studio</strong> — The server detected the face via YOLOv7-tiny (Pass 0). Select a privacy style (Blur, Mosaic, Solid) and click <strong>[⚡ Render Anonymization]</strong>.",
    "guide.step3": "<strong>Step 3: HIAAC-Rec-Labeler</strong> — Select VERTICAL or HORIZONTAL, click on the inertial signal to mark initiation (-1) and end (or use autofill).",
    "guide.step4": "<strong>Step 4: HIAAC-Rec-Viewer</strong> — Inspect multi-annotator alignment (lab 1, lab 2, lab 3), test Consensus modes, and download the standardized research dataset package.",
    "guide.skip": "Skip Step ➜",

    // Stage 1 (Phone App)
    "phone.tag": "STEP 01 • HIAAC-REC-APP",
    "phone.title": "Synchronized Mobile Acquisition",
    "phone.desc": "The Android application performs continuous acquisition of multiple inertial sensor streams and synchronized video directly on the participant's device, ensuring strict temporal integrity and battery efficiency.",
    "phone.f1": "<strong>Simultaneous Multi-Sensor Streams:</strong> Real-time capture of Accelerometer, Gyroscope, Linear Acceleration (configured at 100 Hz for this experiment), and 30 FPS Camera video.",
    "phone.f2": "<strong>Configurable Sampling Frequencies:</strong> Software polling rates from 1 Hz up to 200 Hz executed in dedicated high-priority threads (AIDL).",
    "phone.f3": "<strong>Live Device Telemetry:</strong> Continuous monitoring of power consumption (mAh), battery level, temperature, and network link state.",
    "phone.f4": "<strong>Fault-Tolerant Local Storage:</strong> Resilient local ring buffer protects against Wi-Fi drops, pushing consolidated packages upon session completion.",
    "phone.logsTitle": "ACQUISITION LOGS",
    "phone.serverOnline": "SERVER: ONLINE",
    "phone.dest": "Target",
    "phone.activeSensors": "ACTIVE SENSORS (100 Hz)",
    "phone.pos": "Placement",
    "phone.subj": "Subject",
    "phone.btnStart": "● Start Recording",
    "phone.btnPause": "⏸ Pause",
    "phone.btnResume": "▶ Resume",
    "phone.btnStop": "⏹ Stop Recording",
    "phone.btnUpload": "📤 Send Session to Server",
    "phone.btnUploading": "📤 Sending session eval [all] [02]...",
    "phone.btnUploaded": "✓ Session Uploaded to Server",
    "phone.btnAdvance": "Advance to Stage 2: Face Masking Studio ➜",
    "phone.sensorAccel": "✓ Accelerometer",
    "phone.sensorGyro": "✓ Gyroscope",
    "phone.sensorLin": "✓ Linear Accel.",
    "phone.sensorCam": "✓ Camera (30fps)",
    "phone.logStart": "Recording started at 100 Hz (Accelerometer, Gyroscope, Linear Accel) and 30 FPS Camera.",
    "phone.logPause": "Recording paused.",
    "phone.logResume": "Recording resumed.",
    "phone.logWait": "⚠️ Please observe the VERTICAL (0-12s) and HORIZONTAL (12-24s) motions before finishing.",
    "phone.logStop": "⏹ Recording finished successfully. Local buffer preserved (2,400 inertial samples and video).",
    "phone.logPack": "Packaging local session (session_manifest.json + 4 CSV files + MP4 video)...",
    "phone.logTx": "Transmitting via HTTP POST to SyncServer (:8080)...",
    "phone.logSuccess": "✅ Transmission complete! Server verified 100 Hz temporal integrity.",

    // Stage 2 (Masking Studio)
    "mask.subTitle": "| Anonymization Module",
    "mask.modelTag": "Model: YOLOv7-tiny-head (ONNX, Default)",
    "mask.detectTag": "Detection: 1 fr",
    "mask.padTag": "Head Pad: 20%",
    "mask.passTag": "Pass 0: Automatic",
    "mask.pass0Box": "Pass 0: Tracked Region (YOLOv7-tiny)",
    "mask.panelSessionTitle": "SESSION IN PROCESSING",
    "mask.panelStyleTitle": "ANONYMIZATION MASK STYLE",
    "mask.styleBlur": "Blur (Defocus)",
    "mask.stylePixel": "Pixelate (Mosaic)",
    "mask.styleSolid": "Solid Fill (Black Mask)",
    "mask.boxDesc": "💡 <strong>Automatic Detection:</strong> The server executed the YOLOv7-tiny ONNX detector upon video ingestion. The bounding box can be audited; rendering applies the chosen filter over the tracked coordinates.",
    "mask.btnRender": "⚡ Render Anonymization",
    "mask.btnRendering": "⏳ Rendering",
    "mask.btnRendered": "✓ Anonymization Completed",
    "mask.successMsg": "✓ Video anonymized successfully (100% audited coverage).",
    "mask.btnAdvance": "Advance to Stage 3: HIAAC-Rec-Labeler ➜",
    "mask.logsTitle": "ANONYMIZATION SERVER LOGS",
    "mask.logRender": "[Renderer] Applying {style} filter over coordinates tracked by Pass 0.",
    "mask.logFfmpeg": "[FFmpeg / OpenCV] Processing 720 frames with continuous seamless blending...",
    "mask.logSuccess": "[Success] Final consolidated video: videos/eval [all] [02]_masked_{style}.mp4",

    // Stage 3 (Labeler)
    "labeler.subTitle": "| Synchronized Annotation",
    "labeler.sessionLabel": "Session: <strong>eval [all] [02]</strong>",
    "labeler.sensorLabel": "Sensor: <strong>Accelerometer_Right Hand.csv</strong>",
    "labeler.activeAnnotator": "Active Annotator: <strong style=\"color:var(--orange)\">lab 1 (You)</strong>",
    "labeler.timeLabel": "Time",
    "labeler.activities": "ACTIVITIES:",
    "labeler.btnAutofill": "✨ Autofill lab 1 Annotations",
    "labeler.btnClear": "🔄 Reset / Clear",
    "labeler.convention": "Ends-at convention (-1 and label ID)",
    "labeler.syncCard": "<strong>Synchronized Alignment:</strong> Anonymized video plays in exact frame-accurate synchrony with the inertial time-series. The participant executes VERTICAL (1.6s to 11.0s) followed by HORIZONTAL (13.0s to 23.0s).",
    "labeler.promptDefault": "Select VERTICAL or HORIZONTAL above. Then, click on the signal waveform to mark initiation (-1) and end of the activity.",
    "labeler.promptVertical": "Mark the start point (-1) and end point of the VERTICAL motion on the waveform.",
    "labeler.promptHorizontal": "Mark the start point (-1) and end point of the HORIZONTAL motion on the waveform.",
    "labeler.selectedActivityPrompt": "Activity <strong>{activity}</strong> selected. Click on the signal waveform to mark initiation (-1).",
    "labeler.markedStartPrompt": "Start point marked at <strong>{time}s</strong> (left_label: <strong>-1</strong>). Now click the signal to mark the <strong>end</strong> of <strong>{activity}</strong>.",
    "labeler.markedEndPrompt": "✓ Activity <strong>{activity}</strong> registered from <strong>{start}s</strong> to <strong>{end}s</strong>. Select another activity or click Save Annotations.",
    "labeler.tagStart": "-1 (Start)",
    "labeler.promptDone": "All activity intervals annotated for lab 1. Click below to save and advance.",
    "labeler.thTime": "timestamp (s)",
    "labeler.thLabel": "left_label",
    "labeler.thCp": "change_point_name",
    "labeler.thRef": "sensor_ref",
    "labeler.emptyState": "No annotations recorded yet. Select an activity above and click the waveform.",
    "labeler.btnAdvance": "💾 Save Annotations (eval [all] [02]_Ann_lab 1.csv) & Advance ➜",

    // Stage 4 (Viewer)
    "viewer.subTitle": "| Multi-Annotator Inspection & Consensus",
    "viewer.sessionLabel": "Session: <strong>eval [all] [02]</strong>",
    "viewer.sensorLabel": "Sensor: <strong>Accelerometer (Right Hand)</strong>",
    "viewer.annotators": "ANNOTATORS:",
    "viewer.lab1Label": "lab 1 (You)",
    "viewer.lab2Label": "lab 2 (Annotator 2)",
    "viewer.lab3Label": "lab 3 (Annotator 3)",
    "viewer.consolidation": "CONSOLIDATION:",
    "viewer.helpTitle": "Consolidation Methods",
    "viewer.helpUnionLabel": "Union",
    "viewer.helpUnionDesc": "Interval marked by at least 1 annotator (conflicts omitted).",
    "viewer.helpIntersectionLabel": "Intersection",
    "viewer.helpIntersectionDesc": "Strict consensus — 100% agreement on exact same label.",
    "viewer.helpMajorityLabel": "Majority",
    "viewer.helpMajorityDesc": "Consensus by vote — labeled if &gt;50% annotators agree.",
    "viewer.helpNote": "Export CSV saves the consensus in Labeler format.",
    "viewer.union": "Union",
    "viewer.intersection": "Intersection",
    "viewer.majority": "Majority",
    "viewer.camTitle": "Camera (Synchronized Video)",
    "viewer.timeLabel": "Time",
    "viewer.sensorHeader": "ACCELEROMETER (RIGHT HAND) — 100 HZ",
    "viewer.lab1Role": "Primary (You)",
    "viewer.lab2Role": "Annotator 2",
    "viewer.lab3Role": "Annotator 3",
    "viewer.consensusTrack": "Consensus",
    "viewer.consensusTrackSub": "Consolidated Track",
    "viewer.cardCompleteTitle": "✓ Full Dataset Lifecycle Verified",
    "viewer.cardCompleteDesc": "Evaluation session eval [all] [02] successfully traversed synchronized mobile collection, privacy-preserving face anonymization, ends-at labeling, and multi-annotator consensus consolidation.",
    "viewer.bannerTitle": "HIAAC-Rec-Viewer • Multi-Annotator Consensus Analysis",
    "viewer.bannerDesc": "Observe real-time temporal alignment between synchronized video, 100 Hz accelerometer telemetry, and multi-annotator intervals. Adjust active annotators, change consensus strategy, or finalize the pipeline to export.",
    "viewer.btnRestart": "🔄 Restart Demo",
    "viewer.btnEditAnnotations": "✏️ Edit Annotations",
    "viewer.btnFinish": "🏁 Finish & Export",
    "viewer.btnDownload": "📦 Download Dataset Package (.zip)",

    // Redesigned Dataset Package Modal
    "pkg.title": "📦 Research Dataset Package Ready",
    "pkg.badge": "HIAAC-Rec Pipeline Output",
    "pkg.callout": "This consolidated package is an example output generated by the complete HIAAC-Rec toolkit pipeline for session <code>eval [all] [02]</code>. It bundles multi-modal 100 Hz inertial sensor streams, temporal Cristian's clock alignment, AI face anonymization, and multi-annotator consensus ground truth into a standardized research archive.",
    "pkg.metaSession": "Session ID: eval [all] [02]",
    "pkg.metaHardware": "Hardware: Samsung Galaxy S21 FE",
    "pkg.metaSync": "Max Mean Lag: 3.75 ms (No drift)",
    "pkg.metaPrivacy": "Privacy: 100% Face Anonymized",
    "pkg.secManifest": "Metadata & Provenance",
    "pkg.secVideo": "Synchronized & Anonymized Video",
    "pkg.secSensors": "Standardized Inertial Sensor Streams (100 Hz CSV • 15 files)",
    "pkg.secRawSensors": "Raw Mobile Device Telemetry (5 devices • 3.0 MB)",
    "pkg.secAnnotations": "Multi-Annotator Consensus Ground Truth (6 files)",
    "pkg.btnClose": "Close",
    "pkg.btnDownload": "⬇ Download Package (.zip)",

    // Architecture Section
    "arch.tag": "System Architecture",
    "arch.title": "The Integrated Toolkit Pipeline",
    "arch.subtitle": "A modular architecture for synchronized multimodal acquisition, automated anonymization, and collaborative labeling. Explore the interactive carousel below with real screenshots from the research paper.",
    "arch.step1": "App",
    "arch.step2": "SyncServer",
    "arch.step3": "Face Masking",
    "arch.step4": "Labeler",
    "arch.step5": "Viewer",
    
    // Carousel Slide 1: App
    "arch.s1Title": "HIAAC-Rec-App",
    "arch.s1Port": "Android (Java / CameraX) • Mobile Client",
    "arch.s1Desc": "The mobile acquisition frontend. Directly interfaces with Android hardware sensor APIs using dedicated high-priority threads (AIDL), capturing inertial (accelerometer, gyroscope, linear acceleration, magnetometer, gravity), environmental (ambient temperature, light, proximity), and location (GPS) data at configurable rates from 1 Hz up to 200 Hz, synchronized with nominal 30 FPS video via CameraX. Implements Cristian's algorithm client pings to establish millisecond-precision clock offset before recording.",
    "arch.s1Bullet1": "Configurable sampling rates up to 200 Hz via dedicated background threads without dropping camera frames.",
    "arch.s1Bullet2": "Quality assurance statistics screen displays expected vs collected samples, valid vs discarded ratios, and clock jitter.",
    "arch.s1Bullet3": "Continuous device telemetry profiling (CPU usage %, RAM memory, and battery capacity).",
    "arch.s1Caption": "<strong>Figure 3:</strong> Smartphone acquisition UI (metadata setup, multi-sensor configuration up to 200 Hz, and experiment data statistics).",

    // Carousel Slide 2: SyncServer
    "arch.s2Title": "HIAAC-Rec-SyncServer",
    "arch.s2Port": "Node.js Preprocessor (:8080) • Python Postprocessor (:7998)",
    "arch.s2Desc": "The central synchronization and automated processing backend. The Node.js Preprocessor (:8080) manages experiment configurations, provides Cristian's algorithm reference clock endpoint, receives multi-device uploads, and renders an on-site participant inspection portal with D3.js. The Python Postprocessor daemon (:7998) cleans raw CSVs, trims sensor streams to exact video start/end boundaries, shifts the timeline to video start (t = 0), and triggers automated face anonymization.",
    "arch.s2Bullet1": "Preprocessor REST APIs (/api/file, /api/video, /api/time) handle authentication and multi-device ingestion.",
    "arch.s2Bullet2": "Postprocessor watchdog trims sensor records to exact video boundaries and standardizes per-sensor CSVs.",
    "arch.s2Bullet3": "Web inspection portal enables immediate synchronized playback for on-site participant verification and consent.",
    "arch.s2Caption": "<strong>Figure 6:</strong> Server interface for experiment monitoring, data inspection, and synchronized sensor-video playback.",

    // Carousel Slide 3: Face Masking Studio
    "arch.s3Title": "HIAAC-Rec-Masking-Studio",
    "arch.s3Port": "FastAPI • ONNX Runtime / OpenCV (:8000)",
    "arch.s3Desc": "Privacy-preserving video face anonymization tool combining deep-learning tracking with human verification. It runs an automatic head detector (<strong>YOLOv7-tiny-head ONNX</strong>) achieving 94.59% automatic masking coverage across 25 benchmarked videos, followed by keyframe auditing passes to guarantee full GDPR/LGPD compliance.",
    "arch.s3Bullet1": "Multi-pass auditing trail: Pass 0 (automatic tracking) followed by reproducible manual review passes (Manual 1, Manual 2...).",
    "arch.s3Bullet2": "Track management allows ending, reactivating, and adjusting bounding boxes frame-by-frame.",
    "arch.s3Bullet3": "Render overlay modes: Gaussian blur, mosaic/pixelation, or opaque solid fill, with WebSocket progress streaming.",
    "arch.s3Caption": "<strong>Figure 8:</strong> HIAAC-Rec-Masking-Studio manual auditing interface and timeline tracking.",

    // Carousel Slide 4: Labeler
    "arch.s4Title": "HIAAC-Rec-Labeler",
    "arch.s4Port": "Dash / Plotly • Python (:8050)",
    "arch.s4Desc": "Synchronized time-series annotation interface designed specifically for Human Activity Recognition (HAR). It renders panoramic and detailed zooming charts linked to video playback via a draggable orange time marker at millisecond precision, enabling annotators to inspect raw acceleration signatures while observing the participant's actions.",
    "arch.s4Bullet1": "Standardized 'ends-at' convention (-1 for segment initiation/unassigned, activity label for termination).",
    "arch.s4Bullet2": "Dynamic activity label management via ⚙ gear button, persisted into session manifests and YAML config.",
    "arch.s4Bullet3": "Bidirectional timeline seeking: moving on the signal updates video frames instantaneously.",
    "arch.s4Caption": "<strong>Figure 10:</strong> HIAAC-Rec-Labeler time-series annotation charts synchronized with video.",

    // Carousel Slide 5: Viewer
    "arch.s5Title": "HIAAC-Rec-Viewer",
    "arch.s5Port": "Dash / Plotly • Python (:8052)",
    "arch.s5Desc": "Multi-annotator inspection and consensus consolidation environment. Allows loading independent annotation files from multiple researchers, comparing alignment against the synchronized video and sensor signals, and computing consolidated ground-truth tracks using configurable agreement algorithms.",
    "arch.s5Bullet1": "Three consensus strategies: Union (broadest coverage), Intersection (strict agreement), and Majority voting.",
    "arch.s5Bullet2": "Visual disagreement highlighting in color-coded bands to detect ambiguous movement transitions across annotators.",
    "arch.s5Bullet3": "One-click export of consolidated session packages with manifest, video, sensors, and labels.",
    "arch.s5Caption": "<strong>Figure 11:</strong> HIAAC-Rec-Viewer multi-annotator alignment and consensus evaluation.",

    // Validation Section
    "val.tag": "Experimental Validation",
    "val.title": "Empirical Synchronization & Anonymization Results",
    "val.subtitle": "Extensive experimental evaluation on multiple synchronized smartphones and 25 full-length video recordings from the academic paper.",
    "val.tabSync": "Temporal Synchronization",
    "val.tabMask": "Face Anonymization",
    "val.figSyncCap": "<strong>Figure 15:</strong> Linear acceleration magnitude recorded by the Right Pocket device over the 100Hz run (17 min). Annotated activity windows correspond to controlled displacement events separated by rest.",
    "val.thPlacement": "Device Placement",
    "val.thRate": "Rate (fs)",
    "val.thLag": "Linear Accel Mean Lag",
    "val.thJitter": "Sync Jitter",
    "val.thGyro": "Gyro Mean Lag",
    "val.keySync": "<strong>Key Finding:</strong> Across all annotated windows, the largest absolute mean lag is only <strong>3.75 ms</strong> — well under half of a 100 Hz sampling period (10 ms) — confirming that sensor data across 6 devices remain tightly aligned with zero cumulative drift.",
    "val.figMaskCap": "<strong>Figure 12:</strong> Qualitative comparison of anonymization models on a challenging benchmark video, showing head bounding boxes produced by YOLOv7-tiny-head, MediaPipe, and YOLO-pose.",
    "val.thModel": "Model",
    "val.thTarget": "Target",
    "val.thParams": "Parameters",
    "val.thFPS": "Speed (FPS)",
    "val.thCoverage": "Auto Coverage",
    "val.thStage": "Pipeline Stage",
    "val.thMissing": "Missing Boxes",
    "val.thStatus": "Auditing Status",
    "val.keyMask": "<strong>Key Finding:</strong> YOLOv7-tiny-head achieves <strong>94.59% automatic masking coverage</strong> at <strong>38.3 FPS</strong> on commodity hardware, while successive human auditing passes progressively eliminate missing detections to guarantee GDPR/LGPD compliance.",

    // Paper & Code Section
    "repro.tag": "Reproducibility & Citation",
    "repro.title": "Open-Source Code & Paper Citation",
    "repro.subtitle": "All toolkit components, orchestration scripts, and validation notebooks are released under the MIT license.",
    "repro.tabQuick": "Quickstart (Bash)",
    "repro.tabBib": "BibTeX Citation",
    "repro.copied": "✓ Copied!",
    "repro.copyBtn": "📋 Copy",

    // Footer
    "footer.desc": "HIAAC-Rec is an open-source, modular research toolkit for synchronized multimodal data acquisition, time-series annotation, and face anonymization. Developed at the Hub for Artificial Intelligence and Cognitive Architectures (H.IAAC), UNICAMP, and Instituto Eldorado.",
    "footer.navTitle": "Navigation",
    "footer.resTitle": "Resources",
    "footer.linkPaper": "Paper Draft (PDF)",
    "footer.linkRepo": "GitHub Repository",
    "footer.license": "Released under the MIT License • H.IAAC / UNICAMP / Instituto de Pesquisas Eldorado"
  },

  pt: {
    // Navigation
    "nav.brandSub": "Apresentação Científica",
    "nav.overview": "Visão Geral",
    "nav.demo": "Demo Interativa",
    "nav.arch": "Arquitetura",
    "nav.validation": "Validação",
    "nav.code": "Artigo & Código",
    "nav.demoBtn": "Demo Interativa ▾",
    "nav.themeTitle": "Alternar Tema Claro/Escuro",
    "nav.langTitle": "Switch Language / Mudar Idioma",

    // Hero Section
    "hero.badge": "Apresentação de Artigo Científico • Ferramental Acadêmico Aberto",
    "hero.titleHighlight": "HIAAC-Rec:",
    "hero.titleRest": "Um Ferramental de Código Aberto para Coleta Multimodal Sincronizada, Rotulação e Anonimização Facial",
    "hero.affil1": "Hub de Inteligência Artificial e Arquiteturas Cognitivas (H.IAAC), Campinas, Brasil",
    "hero.affil2": "Universidade Estadual de Campinas (UNICAMP), Campinas, Brasil",
    "hero.affil3": "Instituto de Pesquisas Eldorado, Campinas, Brasil",
    "hero.corrAuthor": "*Autor correspondente: borin@unicamp.br",
    "hero.abstractTag": "RESUMO",
    "hero.abstractText": "Este trabalho apresenta o <strong>HIAAC-Rec</strong>, um ferramental de código aberto para construção de conjuntos de dados multimodais de alta qualidade para Reconhecimento de Atividades Humanas (HAR). Ao contrário de trabalhos anteriores, que disponibilizam somente o dataset ou scripts simples de pré-processamento, o toolkit proposto integra em um pipeline único: aplicativo móvel para smartphone, backend de sincronização e processamento, aplicação para mascaramento e anonimização facial, interface interativa para rotulação de séries temporais e interface de visualização multi-anotador. O ferramental foi validado com seis smartphones gerando 45 canais de sensores a 10 e 100 Hz sincronizados com vídeo a 30 FPS. Os experimentos demonstram defasagem inter-dispositivos inferior a meio período de amostragem (maior atraso médio absoluto de <strong>3.75 ms</strong> sem desvio acumulado) e anonimização facial alcançando <strong>94.59% de cobertura automática</strong>, atingindo consenso total através de auditoria manual em 25 vídeos avaliados.",
    "hero.btnDemo": "⚡ Iniciar Demo Interativa",
    "hero.btnVal": "📊 Validação Empírica",
    "hero.btnCode": "📄 Artigo & Código",

    // Interactive Demo Launcher Card
    "launcher.tag": "DEMONSTRAÇÃO INTERATIVA",
    "launcher.title": "Fluxo Multimodal Completo de Ponta a Ponta",
    "launcher.subtitle": "Sessão: eval [all] [02] • Atividades avaliadas: VERTICAL e HORIZONTAL • Anotadores: lab 1, lab 2 e lab 3. Experimente o fluxo integrado desde a coleta Android até a anonimização facial, rotulação ends-at e visualização de consenso multi-anotador.",
    "launcher.sessionBadge": "Sessão: eval [all] [02] • Sujeito 02 (eval) • 100 Hz",
    "launcher.clickHint": "Clique para Abrir em Tela Cheia",
    "launcher.step1": "Coleta Móvel",
    "launcher.step2": "Masking Studio",
    "launcher.step3": "Labeler",
    "launcher.step4": "Viewer",
    "launcher.desc": "Abra a simulação em tela quase cheia com dados inerciais reais de 100 Hz e vídeo da sessão <code>eval [all] [02]</code>. Teste os estilos de anonimização facial (desfoque, mosaico, preenchimento sólido), marque pontos de início (-1) e fim das atividades no sinal inercial e consolide o consenso entre três anotadores independentes.",
    "launcher.playBtn": "▶ Abrir Demonstração Interativa",
    "launcher.btnText": "🚀 Abrir Demonstração em Tela Cheia",

    // Demo Modal - Steps & Controls
    "modal.close": "✕ Fechar",
    "modal.step1Num": "Etapa 01",
    "modal.step1Title": "HIAAC-Rec-App",
    "modal.step2Num": "Etapa 02",
    "modal.step2Title": "Masking Studio",
    "modal.step3Num": "Etapa 03",
    "modal.step3Title": "HIAAC-Rec-Labeler",
    "modal.step4Num": "Etapa 04",
    "modal.step4Title": "HIAAC-Rec-Viewer",
    "modal.tourToggle": "Modo Guiado",

    // Demo Intro Overlay Modal
    "intro.sessionBadge": "🎯 Sessão de Teste: eval [all] [02]",
    "intro.title": "Demonstração Interativa HIAAC-Rec",
    "intro.desc": "Você irá vivenciar o pipeline multimodal completo do ferramental utilizando uma coleta real de teste. A experiência reproduz cada etapa do ciclo de vida dos dados:",
    "intro.step1Title": "Coleta Móvel",
    "intro.step1Sub": "App • 100 Hz",
    "intro.step2Title": "Masking",
    "intro.step2Sub": "Anonimização Facial",
    "intro.step3Title": "Labeler",
    "intro.step3Sub": "Rotulação Ends-at",
    "intro.step4Title": "Viewer",
    "intro.step4Sub": "Consenso & Export",
    "intro.hint": "💡 Acompanhe o guia interativo com foco escurecido que destaca a próxima ação se você demorar a clicar.",
    "intro.startBtn": "Iniciar Demonstração ➜",

    // Guide Bar Messages
    "guide.step1Initial": "<strong>Etapa 1: Coleta Móvel</strong> — Clique em <strong>[● Iniciar Coleta]</strong> no celular para amostrar sensores a 100 Hz e vídeo da câmera.",
    "guide.step1Recording": "<strong>Coleta em Andamento</strong> — Sensores lendo a 100 Hz sincronizados com a câmera. Observe os movimentos <em>Vertical</em> e <em>Horizontal</em> antes de finalizar.",
    "guide.step1Stopped": "<strong>Coleta Finalizada</strong> — Sessão salva no buffer local. Clique em <strong>[☁ Enviar ao Servidor]</strong> para sincronizar e enviar os arquivos.",
    "guide.step2": "<strong>Etapa 2: Face Masking Studio</strong> — O servidor detectou o rosto via YOLOv7-tiny (Passe 0). Selecione o estilo (Desfoque, Mosaico ou Sólido) e clique em <strong>[⚡ Renderizar Anonimização]</strong>.",
    "guide.step3": "<strong>Etapa 3: HIAAC-Rec-Labeler</strong> — Selecione VERTICAL ou HORIZONTAL, clique no sinal inercial para marcar o início (-1) e o fim da atividade (ou use o preenchimento automático).",
    "guide.step4": "<strong>Etapa 4: HIAAC-Rec-Viewer</strong> — Inspecione o alinhamento das anotações de lab 1, lab 2 e lab 3, teste os modos de Consenso e baixe o pacote final do dataset.",
    "guide.skip": "Pular Etapa ➜",

    // Stage 1 (Phone App)
    "phone.tag": "ETAPA 01 • HIAAC-REC-APP",
    "phone.title": "Coleta Móvel Sincronizada",
    "phone.desc": "O aplicativo móvel Android realiza a aquisição contínua de múltiplos fluxos de sensores inerciais e vídeo sincronizado diretamente no smartphone do participante, garantindo alta precisão temporal e eficiência energética.",
    "phone.f1": "<strong>Múltiplos Sensores em Tempo Real:</strong> Coleta simultânea de Acelerômetro, Giroscópio, Acelerômetro Linear (configurado a 100 Hz neste experimento) e Câmera de vídeo a 30 FPS.",
    "phone.f2": "<strong>Frequência de Amostragem Configurável:</strong> Taxas de 1 Hz a até 200 Hz ajustáveis por sensor em thread de alta prioridade (AIDL).",
    "phone.f3": "<strong>Monitoramento do Aparelho:</strong> Acompanhamento contínuo do consumo de energia (mAh), bateria, temperatura e estado da conexão de rede.",
    "phone.f4": "<strong>Armazenamento Local Seguro:</strong> Buffer local à prova de falhas de Wi-Fi, enviando a sessão consolidada ao servidor após a finalização.",
    "phone.logsTitle": "LOGS DE AQUISIÇÃO",
    "phone.serverOnline": "SERVIDOR: ONLINE",
    "phone.dest": "Destino",
    "phone.activeSensors": "SENSORES ATIVOS (100 Hz)",
    "phone.pos": "Posição",
    "phone.subj": "Sujeito",
    "phone.btnStart": "● Iniciar Coleta",
    "phone.btnPause": "⏸ Pausar",
    "phone.btnResume": "▶ Retomar",
    "phone.btnStop": "⏹ Finalizar Coleta",
    "phone.btnUpload": "📤 Enviar Sessão para o Servidor",
    "phone.btnUploading": "📤 Enviando sessão eval [all] [02]...",
    "phone.btnUploaded": "✓ Sessão Enviada para o Servidor",
    "phone.btnAdvance": "Avançar para Etapa 2: Face Masking Studio ➜",
    "phone.sensorAccel": "✓ Acelerômetro",
    "phone.sensorGyro": "✓ Giroscópio",
    "phone.sensorLin": "✓ Acel. Linear",
    "phone.sensorCam": "✓ Câmera (30fps)",
    "phone.logStart": "Coleta iniciada a 100 Hz (Acelerômetro, Giroscópio, Acel. Linear) e Câmera a 30 FPS.",
    "phone.logPause": "Coleta pausada.",
    "phone.logResume": "Coleta retomada.",
    "phone.logWait": "⚠️ Aguarde a execução dos movimentos VERTICAL (0-12s) e HORIZONTAL (12-24s) antes de finalizar.",
    "phone.logStop": "⏹ Coleta finalizada com sucesso. Buffer local preservado (2400 amostras inerciais e vídeo).",
    "phone.logPack": "Empacotando sessão local (session_manifest.json + 4 arquivos CSV + vídeo MP4)...",
    "phone.logTx": "Transmitindo via HTTP POST para o SyncServer (:8080)...",
    "phone.logSuccess": "✅ Transmissão concluída! Servidor confirmou integridade temporal de 100 Hz.",

    // Stage 2 (Masking Studio)
    "mask.subTitle": "| Módulo de Anonimização",
    "mask.modelTag": "Modelo: YOLOv7-tiny-head (ONNX, Default)",
    "mask.detectTag": "Detecção: 1 fr",
    "mask.padTag": "Head Pad: 20%",
    "mask.passTag": "Passe 0: Automático",
    "mask.pass0Box": "Passe 0: Região Rastreada (YOLOv7-tiny)",
    "mask.panelSessionTitle": "SESSÃO EM PROCESSAMENTO",
    "mask.panelStyleTitle": "ESTILO DA MÁSCARA DE ANONIMIZAÇÃO",
    "mask.styleBlur": "Blur (Desfoque)",
    "mask.stylePixel": "Pixelate (Mosaico)",
    "mask.styleSolid": "Solid Fill (Preto Sólido)",
    "mask.boxDesc": "💡 <strong>Detecção Automática:</strong> O servidor já executou o detector YOLOv7-tiny ONNX ao receber o vídeo. A caixa delimitadora pode ser ajustada para auditoria; a renderização aplicará o efeito nas posições rastreadas.",
    "mask.btnRender": "⚡ Renderizar Anonimização",
    "mask.btnRendering": "⏳ Renderizando",
    "mask.btnRendered": "✓ Anonimização Concluída",
    "mask.successMsg": "✓ Vídeo anonimizado com sucesso (100% de cobertura auditada).",
    "mask.btnAdvance": "Avançar para Etapa 3: HIAAC-Rec-Labeler ➜",
    "mask.logsTitle": "LOGS DO SERVIDOR DE ANONIMIZAÇÃO",
    "mask.logRender": "[Renderizador] Aplicando filtro {style} sobre as coordenadas rastreadas pelo Passe 0.",
    "mask.logFfmpeg": "[FFmpeg / OpenCV] Processando 720 quadros com preenchimento contínuo...",
    "mask.logSuccess": "[Sucesso] Vídeo final consolidado: videos/eval [all] [02]_masked_{style}.mp4",

    // Stage 3 (Labeler)
    "labeler.subTitle": "| Rotulação Sincronizada",
    "labeler.sessionLabel": "Sessão: <strong>eval [all] [02]</strong>",
    "labeler.sensorLabel": "Sensor: <strong>Accelerometer_Right Hand.csv</strong>",
    "labeler.activeAnnotator": "Anotador Ativo: <strong style=\"color:var(--orange)\">lab 1 (Você)</strong>",
    "labeler.timeLabel": "Tempo",
    "labeler.activities": "ATIVIDADES:",
    "labeler.btnAutofill": "✨ Preencher Automaticamente Marcações do lab 1",
    "labeler.btnClear": "🔄 Limpar / Resetar",
    "labeler.convention": "Convenção ends-at (-1 e rótulo)",
    "labeler.syncCard": "<strong>Alinhamento Sincronizado:</strong> O vídeo anonimizado reproduz em sincronia exata com o sinal inercial. O participante executa o movimento VERTICAL (1.6s a 11.0s) e depois o deslocamento HORIZONTAL (13.0s a 23.0s).",
    "labeler.promptDefault": "Selecione VERTICAL ou HORIZONTAL acima. Em seguida, clique no sinal para marcar o início (-1) e o fim da atividade.",
    "labeler.promptVertical": "Marque o ponto de início (-1) e o ponto final do movimento VERTICAL no sinal.",
    "labeler.promptHorizontal": "Marque o ponto de início (-1) e o ponto final do movimento HORIZONTAL no sinal.",
    "labeler.selectedActivityPrompt": "Atividade <strong>{activity}</strong> selecionada. Clique no gráfico do sinal para marcar o <strong>início (-1)</strong>.",
    "labeler.markedStartPrompt": "Ponto de início marcado em <strong>{time}s</strong> (left_label: <strong>-1</strong>). Agora clique no sinal para marcar o <strong>fim</strong> de <strong>{activity}</strong>.",
    "labeler.markedEndPrompt": "✓ Atividade <strong>{activity}</strong> registrada de <strong>{start}s</strong> a <strong>{end}s</strong>. Selecione outra atividade ou clique em Salvar Anotações.",
    "labeler.tagStart": "-1 (Início)",
    "labeler.promptDone": "Todos os intervalos de atividade foram marcados para o lab 1. Clique abaixo para salvar e avançar.",
    "labeler.thTime": "timestamp (s)",
    "labeler.thLabel": "left_label",
    "labeler.thCp": "change_point_name",
    "labeler.thRef": "sensor_ref",
    "labeler.emptyState": "Nenhuma anotação registrada ainda. Selecione uma atividade acima e clique no sinal.",
    "labeler.btnAdvance": "💾 Salvar Anotações (eval [all] [02]_Ann_lab 1.csv) & Avançar ➜",

    // Stage 4 (Viewer)
    "viewer.subTitle": "| Inspeção Multi-Anotador & Consenso",
    "viewer.sessionLabel": "Sessão: <strong>eval [all] [02]</strong>",
    "viewer.sensorLabel": "Sensor: <strong>Accelerometer (Right Hand)</strong>",
    "viewer.annotators": "ANOTADORES:",
    "viewer.lab1Label": "lab 1 (Você)",
    "viewer.lab2Label": "lab 2 (Anotador 2)",
    "viewer.lab3Label": "lab 3 (Anotador 3)",
    "viewer.consolidation": "CONSOLIDAÇÃO:",
    "viewer.helpTitle": "Métodos de Consolidação",
    "viewer.helpUnionLabel": "União",
    "viewer.helpUnionDesc": "Intervalo marcado por ao menos 1 anotador (conflitos omitidos).",
    "viewer.helpIntersectionLabel": "Intersecção",
    "viewer.helpIntersectionDesc": "Consenso estrito — concordância de 100% no mesmo rótulo.",
    "viewer.helpMajorityLabel": "Maioria",
    "viewer.helpMajorityDesc": "Consenso por votação — rotulado se &gt;50% dos anotadores concordam.",
    "viewer.helpNote": "A exportação em CSV salva o consenso no formato do Labeler.",
    "viewer.union": "União",
    "viewer.intersection": "Intersecção",
    "viewer.majority": "Maioria",
    "viewer.camTitle": "Câmera (Vídeo Sincronizado)",
    "viewer.timeLabel": "Tempo",
    "viewer.sensorHeader": "ACELERÔMETRO (RIGHT HAND) — 100 HZ",
    "viewer.lab1Role": "Principal (Você)",
    "viewer.lab2Role": "Anotador 2",
    "viewer.lab3Role": "Anotador 3",
    "viewer.consensusTrack": "Consenso",
    "viewer.consensusTrackSub": "Trilha Consolidada",
    "viewer.cardCompleteTitle": "✓ Fluxo Completo do Dataset Verificado",
    "viewer.cardCompleteDesc": "A sessão eval [all] [02] transitou com sucesso pela coleta móvel, anonimização facial com privacidade garantida, rotulação ends-at e consenso entre anotadores.",
    "viewer.bannerTitle": "HIAAC-Rec-Viewer • Análise de Consenso Multi-Anotador",
    "viewer.bannerDesc": "Acompanhe o alinhamento temporal em tempo real entre vídeo sincronizado, telemetria do acelerômetro a 100 Hz e anotações dos especialistas. Alterne anotadores, mude a estratégia de consenso ou finalize o pipeline para exportação.",
    "viewer.btnRestart": "🔄 Reiniciar Demonstração",
    "viewer.btnEditAnnotations": "✏️ Arrumar Anotação",
    "viewer.btnFinish": "🏁 Finalizar",
    "viewer.btnDownload": "📦 Baixar Pacote do Dataset (.zip)",

    // Redesigned Dataset Package Modal
    "pkg.title": "📦 Pacote Consolidado do Dataset Pronto",
    "pkg.badge": "Exemplo do Pipeline HIAAC-Rec",
    "pkg.callout": "Este pacote consolidado é um exemplo real gerado pelo pipeline completo do HIAAC-Rec para a sessão <code>eval [all] [02]</code>. Ele reúne os fluxos inerciais a 100 Hz, sincronização temporal via Cristian's algorithm, anonimização facial por IA e o consenso multi-anotador em um arquivo estruturado de pesquisa.",
    "pkg.metaSession": "Sessão: eval [all] [02]",
    "pkg.metaHardware": "Dispositivo: Samsung Galaxy S21 FE",
    "pkg.metaSync": "Atraso Médio Máx: 3.75 ms (Sem drift)",
    "pkg.metaPrivacy": "Privacidade: 100% Rostos Anonimizados",
    "pkg.secManifest": "Metadados & Proveniência",
    "pkg.secVideo": "Vídeo Sincronizado & Anonimizado",
    "pkg.secSensors": "Séries Temporais Inerciais Padronizadas (15 CSVs a 100 Hz)",
    "pkg.secRawSensors": "Logs Brutos de Telemetria (5 dispositivos celulares • 3.0 MB)",
    "pkg.secAnnotations": "Consenso Multi-Anotador (6 arquivos CSV)",
    "pkg.btnClose": "Fechar",
    "pkg.btnDownload": "⬇ Baixar Pacote (.zip)",

    // Architecture Section
    "arch.tag": "Arquitetura do Sistema",
    "arch.title": "Os Componentes Integrados do Toolkit",
    "arch.subtitle": "Uma infraestrutura modular para aquisição multimodal sincronizada, anonimização automatizada e rotulação colaborativa. Explore o carrossel interativo abaixo com imagens reais do artigo acadêmico.",
    "arch.step1": "App",
    "arch.step2": "SyncServer",
    "arch.step3": "Face Masking",
    "arch.step4": "Labeler",
    "arch.step5": "Viewer",

    // Carousel Slide 1: App
    "arch.s1Title": "HIAAC-Rec-App",
    "arch.s1Port": "Android (Java / CameraX) • Cliente Móvel",
    "arch.s1Desc": "O frontend de coleta móvel. Conecta-se diretamente às APIs de sensores de hardware por meio de threads dedicadas de alta prioridade (AIDL), capturando sensores inerciais (acelerômetro, giroscópio, acelerômetro linear, magnetômetro, gravidade), ambientais (temperatura, luminosidade, proximidade) e localização (GPS) em frequências configuráveis de 1 Hz a até 200 Hz, além de gravação de vídeo a 30 FPS nominais com CameraX. Implementa o algoritmo de Cristian para estimar a defasagem temporal com o servidor em milissegundos antes da gravação.",
    "arch.s1Bullet1": "Taxas de amostragem configuráveis de até 200 Hz via threads em segundo plano sem perda de quadros de vídeo.",
    "arch.s1Bullet2": "Tela de estatísticas e controle de qualidade com amostras esperadas vs. coletadas, taxa de descarte e jitter temporal.",
    "arch.s1Bullet3": "Monitoramento de telemetria do dispositivo (uso de CPU %, memória RAM e capacidade da bateria).",
    "arch.s1Caption": "<strong>Figura 3:</strong> Interface móvel de coleta (configuração de metadados, seleção de sensores a até 200 Hz e estatísticas dos dados).",

    // Carousel Slide 2: SyncServer
    "arch.s2Title": "HIAAC-Rec-SyncServer",
    "arch.s2Port": "Node.js Pré-processador (:8080) • Python Pós-processador (:7998)",
    "arch.s2Desc": "O backend central de sincronização e processamento automatizado. O Pré-processador Node.js (:8080) gerencia configurações centralizadas, fornece o endpoint de relógio de referência para o algoritmo de Cristian, recebe uploads dos dispositivos e disponibiliza portal de inspeção imediata com gráficos D3.js para consentimento no local. O daemon Pós-processador em Python (:7998) limpa os CSVs brutos, recorta os registros de sensores exatamente aos limites do vídeo, alinha a linha do tempo ao início do vídeo (t = 0) e despacha a anonimização automática.",
    "arch.s2Bullet1": "APIs REST do pré-processador (/api/file, /api/video, /api/time) gerenciam autenticação e ingestão multi-dispositivo.",
    "arch.s2Bullet2": "Watchdog do pós-processador recorta leituras fora do intervalo e padroniza arquivos CSV por sensor.",
    "arch.s2Bullet3": "Portal web de inspeção viabiliza reprodução sincronizada para verificação imediata e consentimento dos participantes.",
    "arch.s2Caption": "<strong>Figura 6:</strong> Interface do servidor para monitoramento de experimentos, inspeção de dados e reprodução sincronizada de sensores e vídeo.",

    // Carousel Slide 3: Face Masking Studio
    "arch.s3Title": "HIAAC-Rec-Masking-Studio",
    "arch.s3Port": "FastAPI • ONNX Runtime / OpenCV (:8000)",
    "arch.s3Desc": "Ferramenta de anonimização facial de vídeo que combina rastreamento por aprendizado profundo com auditoria humana. Utiliza um detector de cabeças otimizado (<strong>YOLOv7-tiny-head ONNX</strong>) atingindo 94.59% de cobertura automática em 25 vídeos de benchmark, seguido por passes de revisão manual (atingindo 99.73% antes da validação final) para garantir conformidade estrita com LGPD/GDPR.",
    "arch.s3Bullet1": "Trilha de auditoria em múltiplos passes: Passe 0 (automático) seguido por passes manuais reprodutíveis (Manual 1, Manual 2...).",
    "arch.s3Bullet2": "Gerenciamento interativo de tracks permite encerrar desvios, reativar identidades e estender caixas sobre breves oclusões.",
    "arch.s3Bullet3": "Modos de renderização: desfoque gaussiano, mosaico/pixelamento ou preenchimento sólido preto, com WebSocket em tempo real.",
    "arch.s3Caption": "<strong>Figura 8:</strong> Interface de auditoria manual e rastreamento da linha do tempo no HIAAC-Rec-Masking-Studio.",

    // Carousel Slide 4: Labeler
    "arch.s4Title": "HIAAC-Rec-Labeler",
    "arch.s4Port": "Dash / Plotly • Python (:8050)",
    "arch.s4Desc": "Interface de anotação de séries temporais sincronizadas projetada para Reconhecimento de Atividades Humanas (HAR). Renderiza gráficos panorâmicos e com zoom detalhado vinculados à reprodução de vídeo via cursor laranja arrastável com resolução em milissegundos, permitindo aos anotadores correlacionar a assinatura inercial às ações do participante.",
    "arch.s4Bullet1": "Convenção padronizada 'ends-at': -1 para marcação de início/intervalo não rotulado, e nome da atividade para término.",
    "arch.s4Bullet2": "Gerenciamento dinâmico de rótulos via botão ⚙ (engrenagem), persistido no manifesto da sessão e no config.yaml.",
    "arch.s4Bullet3": "Navegação temporal bidirecional: mover o cursor no sinal atualiza os quadros do vídeo instantaneamente.",
    "arch.s4Caption": "<strong>Figura 10:</strong> Gráficos de anotação de séries temporais sincronizados com vídeo no HIAAC-Rec-Labeler.",

    // Carousel Slide 5: Viewer
    "arch.s5Title": "HIAAC-Rec-Viewer",
    "arch.s5Port": "Dash / Plotly • Python (:8052)",
    "arch.s5Desc": "Ambiente de inspeção multi-anotador e consolidação de consenso. Permite carregar anotações independentes de múltiplos pesquisadores, comparar o alinhamento visual com o sinal inercial e o vídeo sincronizado, e consolidar a trilha de ground-truth utilizando algoritmos configuráveis de concordância.",
    "arch.s5Bullet1": "Três estratégias de consenso: União (cobertura ampla), Intersecção (acordo unânime estrito) e Maioria.",
    "arch.s5Bullet2": "Destaque visual em faixas coloridas para identificar concordâncias e transições ambíguas de movimentos.",
    "arch.s5Bullet3": "Exportação em 1 clique do pacote consolidado da sessão com manifesto, vídeo, sensores e anotações no formato do Labeler.",
    "arch.s5Caption": "<strong>Figura 11:</strong> Alinhamento multi-anotador e consolidação de consenso no HIAAC-Rec-Viewer.",

    // Validation Section
    "val.tag": "Validação Experimental",
    "val.title": "Resultados Empíricos de Sincronização & Anonimização",
    "val.subtitle": "Avaliação experimental abrangente realizada com múltiplos smartphones sincronizados e 25 gravações completas de vídeo presentes no artigo acadêmico.",
    "val.tabSync": "Sincronização Temporal",
    "val.tabMask": "Anonimização Facial",
    "val.figSyncCap": "<strong>Figura 15:</strong> Magnitude da aceleração linear registrada pelo dispositivo no bolso direito durante corrida a 100 Hz (17 min). Janelas anotadas correspondem a eventos controlados de deslocamento intercalados por repouso.",
    "val.thPlacement": "Posição do Aparelho",
    "val.thRate": "Taxa (fs)",
    "val.thLag": "Atraso Médio Acel. Linear",
    "val.thJitter": "Jitter de Sincronia",
    "val.thGyro": "Atraso Médio Giroscópio",
    "val.keySync": "<strong>Resultado Principal:</strong> Em todas as janelas anotadas, o maior atraso médio absoluto foi de apenas <strong>3.75 ms</strong> — bem inferior a meio período de amostragem de 100 Hz (10 ms) —, confirmando alinhamento estrito entre 6 dispositivos sem acúmulo de drift.",
    "val.figMaskCap": "<strong>Figura 12:</strong> Comparação qualitativa dos modelos de anonimização em vídeo desafiador de benchmark, exibindo as caixas delimitadoras produzidas por YOLOv7-tiny-head, MediaPipe e YOLO-pose.",
    "val.thModel": "Modelo",
    "val.thTarget": "Alvo",
    "val.thParams": "Parâmetros",
    "val.thFPS": "Velocidade (FPS)",
    "val.thCoverage": "Cobertura Automática",
    "val.thStage": "Etapa do Pipeline",
    "val.thMissing": "Caixas Ausentes",
    "val.thStatus": "Status de Auditoria",
    "val.keyMask": "<strong>Resultado Principal:</strong> O modelo YOLOv7-tiny-head atinge <strong>94.59% de cobertura automática</strong> a <strong>38.3 FPS</strong> em hardware comum, enquanto passes manuais subsequentes eliminam omissões residuais para garantir total conformidade com LGPD/GDPR.",

    // Paper & Code Section
    "repro.tag": "Reprodutibilidade & Citação",
    "repro.title": "Código Aberto & Citação do Artigo",
    "repro.subtitle": "Todos os componentes do ferramental, scripts de orquestração e notebooks de validação são distribuídos sob a licença MIT.",
    "repro.tabQuick": "Início Rápido (Bash)",
    "repro.tabBib": "Citação BibTeX",
    "repro.copied": "✓ Copiado!",
    "repro.copyBtn": "📋 Copiar",

    // Footer
    "footer.desc": "HIAAC-Rec é um ferramental modular de código aberto para aquisição multimodal sincronizada, rotulação de séries temporais e anonimização facial. Desenvolvido no Hub de Inteligência Artificial e Arquiteturas Cognitivas (H.IAAC), UNICAMP e Instituto de Pesquisas Eldorado.",
    "footer.navTitle": "Navegação",
    "footer.resTitle": "Recursos",
    "footer.linkPaper": "Texto do Artigo (PDF)",
    "footer.linkRepo": "Repositório no GitHub",
    "footer.license": "Distribuído sob Licença MIT • H.IAAC / UNICAMP / Instituto de Pesquisas Eldorado"
  }
};

class I18nManager {
  constructor() {
    this.currentLang = localStorage.getItem("hiaac_lang") || "en";
  }

  init() {
    this.applyLanguage(this.currentLang);
    this.bindEvents();
  }

  bindEvents() {
    const toggleBtn = document.getElementById("lang-toggle-btn");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        const next = this.currentLang === "en" ? "pt" : "en";
        this.setLanguage(next);
      });
    }
  }

  setLanguage(lang) {
    if (lang !== "en" && lang !== "pt") return;
    this.currentLang = lang;
    localStorage.setItem("hiaac_lang", lang);
    this.applyLanguage(lang);
  }

  t(key) {
    const dict = I18N_TRANSLATIONS[this.currentLang] || I18N_TRANSLATIONS.en;
    return dict[key] || I18N_TRANSLATIONS.en[key] || key;
  }

  applyLanguage(lang) {
    document.documentElement.setAttribute("lang", lang);
    const dict = I18N_TRANSLATIONS[lang] || I18N_TRANSLATIONS.en;

    // Update active tags on toggle buttons
    document.querySelectorAll(".lang-tag").forEach((tag) => {
      tag.classList.toggle("active", tag.dataset.lang === lang);
    });

    // Translate all elements with data-i18n
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key]) {
        el.innerHTML = dict[key];
      }
    });

    // Translate attributes if specified (e.g., data-i18n-title)
    document.querySelectorAll("[data-i18n-title]").forEach((el) => {
      const key = el.getAttribute("data-i18n-title");
      if (dict[key]) {
        el.setAttribute("title", dict[key]);
      }
    });

    // Notify interactive demo controller if running
    if (window.hiaacDemo && typeof window.hiaacDemo.onLanguageChange === "function") {
      window.hiaacDemo.onLanguageChange(lang);
    }
  }
}

// Global instance
window.hiaacI18n = new I18nManager();
document.addEventListener("DOMContentLoaded", () => {
  window.hiaacI18n.init();
});

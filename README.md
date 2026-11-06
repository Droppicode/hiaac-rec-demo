# HIAAC-Rec: Academic Research Presentation & Interactive Walkthrough

Research presentation and interactive dataset flow simulator for the scientific paper:  
**"HIAAC-Rec: An Open-Source Toolkit for Synchronized Multimodal Data Collection, Annotation, and Face Anonymization"**  
*Beatriz V. P. Moura, Marcos M. Nunes, Gustavo P. C. P. da Luz, Miguel B. Simões, Victor Wu, Nicolas H. Silva, Jaime A. D. Vargas, Amparo D. Muñoz, Saulo A. Moraes, Felipe A. de Paula Santos, Fabio Grassiotto, Anderson Rocha, Levy Boccato, Edson Borin*  
*(H.IAAC, University of Campinas UNICAMP & Instituto de Pesquisas Eldorado)*.

---

## Academic Focus & Key Contributions

Unlike generic consumer loggers, this presentation focuses on the scientific and methodological rigor of the toolkit:

1. **⏱️ Inter-Device Synchronization (Cristian's Algorithm)**:
   - Evaluated with 5 stacked smartphones (Annotator, Right Pocket, Left Pocket, Right Hand, Crossbody Bag) producing 45 sensor channels at 10Hz and 100Hz alongside synchronized 30fps video.
   - **Largest absolute mean lag $\le 3.75\text{ ms}$** (below half a sampling period $T_s / 2 = 5\text{ ms}$ at 100Hz).
   - **Zero relative drift** observed across 17 minutes of continuous capture.

2. **🎭 Face Anonymization Evaluation (25 Videos, 1.1M Masks)**:
   - Evaluated across four pipeline stages: Automatic YOLOv7-tiny (94.59%) → +Annotator 1 (98.53%) → +Annotator 2 (99.73%) → Final Validated Reference (100.00%).
   - Preserves complete audit trails across passes without cloud dependency.

3. **🏷️ Synchronized Multimodal Labeling & Consensus**:
   - Millisecond-aligned bidirectional scrubbing between video and sensor waveforms.
   - Consolidation modes (Union, Intersection, Majority) with inter-rater reliability metrics ($\kappa = 0.92$).

---

## Interactive Dataset Flow Simulation

1. **📱 Stage 1: HIAAC-Rec-App (Android Collection)**:
   - Interactive smartphone simulator with live 100Hz IMU 3-axis canvas waveform.
   - Synchronized CameraX 30fps video viewfinder and Cristian's algorithm offset estimation.

2. **🎭 Stage 2: HIAAC-Rec-Masking-Studio (FastAPI Anonymizer)**:
   - YOLOv7-tiny ONNX head detection with interactive mask modes (`Blur`, `Pixelate`, `Solid Fill`).
   - Server progress logs and before/after raw vs. anonymized video comparison.

3. **🏷️ Stage 3: HIAAC-Rec-Labeler (Annotation Interface)**:
   - Real 500-point accelerometer time-series extracted from evaluation session `eval [all] [01]`.
   - Synchronized video player with timeline scrubber and ends-at change-point labeling (`STANDING`, `SITTING`, `WALKING`, `CYCLING`).

4. **📊 Stage 4: HIAAC-Rec-Viewer (Consensus & Export)**:
   - Multi-annotator comparison lanes (`Annotator m` vs `Annotator G`).
   - Consensus calculation modes (`Intersection`, `Union`, `Majority`).
   - Manifest tree inspector and research dataset package download (`.zip`).

---

## Project Structure

```
hiaac-rec-demo/
├── index.html                 # Main presentation & interactive demo page
├── css/
│   ├── hiaac-theme.css        # Shared H.IAAC design system tokens (light & dark mode)
│   ├── landing.css            # Hero, navigation, typography, and responsive styling
│   └── interactive-demo.css   # Phone mockup, studio windows, waveform canvas, and modal styling
├── js/
│   ├── main.js                # Theme switcher, scroll spy, clipboard, and sensor playground
│   ├── demo-flow.js           # 4-stage interactive walkthrough engine and state machine
│   └── mock-data.js           # Real time-series slice from session eval [all] [01]
└── assets/
    ├── images/                # HIAAC logo (SVG), extracted video frames, qualitative diagrams
    ├── videos/                # Web-optimized synchronized raw and anonymized clips
    └── fonts/                 # JetBrains Mono webfonts
```

---

## Running Locally

Como você já está dentro da pasta `hiaac-rec-demo/`, basta executar o script auxiliar:

```bash
./run_demo.sh
```

Ou diretamente via Python:

```bash
python3 -m http.server 8088
```

Depois acesse no navegador:
**http://localhost:8088/**


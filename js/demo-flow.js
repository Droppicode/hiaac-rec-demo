/* =============================================================================
   HIAAC-Rec Interactive Dataset Flow Engine (demo-flow.js)
   Sessão: eval [all] [02] • Atividades: VERTICAL e HORIZONTAL
   Anotadores: lab 1 (usuário), lab 2, lab 3 • Vídeo com privacidade garantida
   ============================================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const demo = new HiaacDemoController();
  demo.init();
  window.hiaacDemo = demo; // Accessible globally
});

class HiaacDemoController {
  constructor() {
    this.currentStep = 1;
    this.totalDuration = 24.0; // 24.0s eval02 cut

    // Stage 1 (Phone App)
    this.isRecording = false;
    this.isPaused = false;
    this.recordTimer = null;
    this.elapsedSeconds = 0;
    this.hasCompletedCycle = false; // Must see both vertical & horizontal
    this.phoneAnimId = null;

    // Stage 2 (Face Masking Studio)
    this.maskStyle = "blur"; // blur | pixelate | solid
    this.isMaskRendered = false;
    this.renderedVideoSrc = "assets/videos/eval02_masked_blur.mp4";

    // Stage 3 (Labeler)
    this.selectedActivity = "VERTICAL";
    this.currentPendingStart = null; // { t: number, activity: string }
    this.userAnnotations = []; // [{ start, end, label, color }]
    this.isAnnoPlaying = false;

    // Stage 4 (Viewer)
    this.viewerConsensusMode = "union"; // union | intersection | majority
    this.isViewerPlaying = false;
    this.activeAnnotators = {
      lab1: true,
      lab2: true,
      lab3: true
    };

    // Tour exploration state flags
    this.stage2StyleSeen = false;
    this.stage3LabelsSeen = false;
    this.stage4ConsensusSeen = false;
    this.spotlightAutoAdvanceTimer = null;
  }

  init() {
    this.bindModalControls();
    this.bindStepper();
    this.initSpotlight();
    this.setupStage1Phone();
    this.setupStage2Masking();
    this.setupStage3Labeler();
    this.setupStage4Viewer();
    if (window.hiaacI18n) {
      this.onLanguageChange(window.hiaacI18n.currentLang);
    } else {
      this.updateGuide();
    }
    window.addEventListener("resize", () => {
      if (this.currentStep === 4) {
        this.drawViewerWaveform();
        const video = document.getElementById("viewer-video");
        this.updateViewerScrubber(video ? video.currentTime : 0);
      }
    });
  }

  // ===========================================================================
  // MODAL CONTROLS (Near-Fullscreen Modal)
  // ===========================================================================
  bindModalControls() {
    const backdrop = document.getElementById("demo-modal-backdrop");
    const closeBtn = document.getElementById("demo-modal-close-btn");
    const heroBtn = document.getElementById("btn-hero-launch-demo");
    const launcherBtn = document.getElementById("btn-open-demo-modal");
    const launcherCard = document.getElementById("demo-launcher-trigger");
    const navBtn = document.getElementById("nav-open-demo-btn");

    // Intro Overlay Modal (displayed on top of the demo modal)
    const introModal = document.getElementById("demo-intro-modal-backdrop");
    const startFlowBtn = document.getElementById("btn-start-demo-flow");
    const closeIntroBtn = document.getElementById("btn-close-intro-modal");

    const hideIntroModal = () => {
      if (introModal) introModal.classList.add("hidden");
      this.queueTourStep("stage1_record", true);
    };

    const showIntroModal = () => {
      if (introModal) introModal.classList.remove("hidden");
    };

    if (startFlowBtn) startFlowBtn.addEventListener("click", hideIntroModal);
    if (closeIntroBtn) closeIntroBtn.addEventListener("click", hideIntroModal);

    if (introModal) {
      introModal.addEventListener("click", (e) => {
        if (e.target === introModal) hideIntroModal();
      });
    }

    const openModal = () => {
      if (!backdrop) return;
      backdrop.classList.add("open");
      document.body.style.overflow = "hidden";
      showIntroModal();
      // Trigger redraw of canvas in current stage
      if (this.currentStep === 1) {
        this.startPhoneWaveform();
      } else if (this.currentStep === 3) {
        this.drawAnnoWaveform();
      } else if (this.currentStep === 4) {
        this.drawViewerWaveform();
      }
    };

    const closeModal = () => {
      if (!backdrop) return;
      backdrop.classList.remove("open");
      document.body.style.overflow = "";
      this.hideSpotlight(true);
      this.pauseAllVideos();
    };

    if (heroBtn) heroBtn.addEventListener("click", openModal);
    if (launcherBtn) launcherBtn.addEventListener("click", (e) => { e.stopPropagation(); openModal(); });
    if (launcherCard) launcherCard.addEventListener("click", openModal);
    if (navBtn) navBtn.addEventListener("click", (e) => { e.preventDefault(); openModal(); });

    if (closeBtn) closeBtn.addEventListener("click", closeModal);

    if (backdrop) {
      backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) closeModal();
      });
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (this.isSpotlightDarkened) {
          e.preventDefault();
          e.stopPropagation();
          this.hideSpotlight(true);
          return;
        }
        if (introModal && !introModal.classList.contains("hidden")) {
          hideIntroModal();
        } else if (backdrop && backdrop.classList.contains("open")) {
          closeModal();
        }
      }
    });
  }

  pauseAllVideos() {
    const videos = [
      document.getElementById("phone-camera-video"),
      document.getElementById("studio-video"),
      document.getElementById("anno-video"),
      document.getElementById("viewer-video")
    ];
    videos.forEach((v) => {
      if (v && !v.paused) v.pause();
    });
  }

  // ===========================================================================
  // STEPPER & GUIDE BAR
  // ===========================================================================
  bindStepper() {
    const tabs = document.querySelectorAll(".step-tab");
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const step = parseInt(tab.dataset.step, 10);
        this.goToStep(step);
      });
    });
  }

  goToStep(step) {
    if (step < 1 || step > 4) return;
    this.currentStep = step;

    // Clear any pending timers when changing steps to prevent ghost transitions
    clearTimeout(this.spotlightIdleTimer);
    clearTimeout(this.spotlightAutoAdvanceTimer);

    // Tabs
    document.querySelectorAll(".step-tab").forEach((tab) => {
      const s = parseInt(tab.dataset.step, 10);
      tab.classList.toggle("active", s === step);
    });

    // Panes
    document.querySelectorAll(".stage-pane").forEach((pane) => {
      const s = parseInt(pane.dataset.stage, 10);
      pane.classList.toggle("active", s === step);
    });

    this.updateGuide();

    // Step entry hooks
    if (step === 1) {
      this.startPhoneWaveform();
      const isFreshStart = !this.isRecording && this.elapsedSeconds === 0;
      this.queueTourStep(this.isRecording ? "stage1_stop" : "stage1_record", isFreshStart);
    } else {
      this.stopPhoneWaveform();
    }

    if (step === 2) {
      const studioVid = document.getElementById("studio-video");
      if (studioVid) {
        if (this.isMaskRendered && this.renderedVideoSrc) {
          studioVid.src = this.renderedVideoSrc;
        }
        if (studioVid.paused) studioVid.play().catch(() => {});
      }
      if (this.isMaskRendered) {
        this.queueTourStep("stage2_next");
      } else if (!this.stage2StyleSeen) {
        this.queueTourStep("stage2_style", true);
      } else {
        this.queueTourStep("stage2_render");
      }
    }

    if (step === 3) {
      this.drawAnnoWaveform();
      const annoVid = document.getElementById("anno-video");
      if (annoVid) {
        if (this.isMaskRendered && this.renderedVideoSrc) {
          annoVid.src = this.renderedVideoSrc;
        }
        annoVid.currentTime = 0.05;
      }
      if (this.userAnnotations.length > 0) {
        this.queueTourStep("stage3_next");
      } else if (!this.stage3LabelsSeen) {
        this.queueTourStep("stage3_labels", true);
      } else {
        this.queueTourStep("stage3_autofill");
      }
    }

    if (step === 4) {
      const viewerVid = document.getElementById("viewer-video");
      if (viewerVid) {
        if (this.isMaskRendered && this.renderedVideoSrc) {
          viewerVid.src = this.renderedVideoSrc;
        }
        viewerVid.currentTime = 0.05;
      }
      this.updateDownloadPackage();
      this.renderViewerTracks();
      this.drawViewerWaveform();
      setTimeout(() => {
        this.drawViewerWaveform();
        this.updateViewerScrubber(viewerVid ? viewerVid.currentTime : 0);
      }, 50);
      if (!this.stage4ConsensusSeen) {
        this.queueTourStep("stage4_consensus", true);
      } else {
        this.queueTourStep("stage4_finish");
      }
    }
  }

  markStepCompleted(step) {
    const tab = document.querySelector(`.step-tab[data-step="${step}"]`);
    if (tab) {
      tab.classList.add("completed");
      const badge = tab.querySelector(".step-badge");
      if (badge) badge.textContent = "✓";
    }
  }

  t(key) {
    if (window.hiaacI18n && typeof window.hiaacI18n.t === "function") {
      return window.hiaacI18n.t(key);
    }
    return key;
  }

  onLanguageChange(lang) {
    this.updateGuide();
    this.updateDownloadPackage();

    // Stage 1 controls
    const recordBtn = document.getElementById("btn-phone-record");
    if (recordBtn) {
      const span = recordBtn.querySelector("span:not(.hotspot-pulse)");
      if (span) span.textContent = this.t("phone.btnStart");
    }

    const pauseBtn = document.getElementById("btn-phone-pause");
    if (pauseBtn) {
      pauseBtn.textContent = this.isPaused ? this.t("phone.btnResume") : this.t("phone.btnPause");
    }

    const stopBtn = document.getElementById("btn-phone-stop");
    if (stopBtn) {
      stopBtn.textContent = this.t("phone.btnStop");
    }

    const uploadBtn = document.getElementById("btn-phone-upload");
    if (uploadBtn) {
      const span = uploadBtn.querySelector("span");
      if (span) {
        span.textContent = this.isCompletedCycle && !this.isRecording && uploadBtn.disabled
          ? this.t("phone.btnUploaded")
          : this.t("phone.btnUpload");
      }
    }

    const stage1Next = document.getElementById("stage1-next-btn");
    if (stage1Next) {
      const span = stage1Next.querySelector("span");
      if (span) span.textContent = this.t("phone.btnAdvance");
    }

    // Stage 2 controls
    const runMaskBtn = document.getElementById("btn-run-masking");
    if (runMaskBtn) {
      const span = runMaskBtn.querySelector("span:not(.hotspot-pulse)");
      if (span) {
        span.textContent = this.isMaskRendered ? this.t("mask.btnRendered") : this.t("mask.btnRender");
      }
    }

    const stage2Next = document.getElementById("stage2-next-btn");
    if (stage2Next) {
      const span = stage2Next.querySelector("span");
      if (span) span.textContent = this.t("mask.btnAdvance");
    }

    // Stage 3 controls
    const autofillBtn = document.getElementById("btn-autofill-lab1");
    if (autofillBtn) autofillBtn.textContent = this.t("labeler.btnAutofill");

    const resetLabelerBtn = document.getElementById("btn-reset-labeler");
    if (resetLabelerBtn) resetLabelerBtn.textContent = this.t("labeler.btnClear");

    const stage3Next = document.getElementById("stage3-next-btn");
    if (stage3Next) {
      const span = stage3Next.querySelector("span");
      if (span) span.textContent = this.t("labeler.btnAdvance");
    }

    const instructionBox = document.getElementById("anno-step-instruction");
    if (instructionBox) {
      if (this.currentPendingStart) {
        instructionBox.innerHTML = this.t("labeler.markedStartPrompt")
          .replace("{time}", this.currentPendingStart.t.toFixed(2))
          .replace("{activity}", this.currentPendingStart.activity);
      } else if (this.userAnnotations && this.userAnnotations.length > 0) {
        instructionBox.innerHTML = this.t("labeler.promptDone");
      } else {
        instructionBox.innerHTML = this.t("labeler.promptDefault");
      }
    }
    this.updateAnnoTable();
    this.drawAnnoWaveform();

    // Stage 4 controls
    this.updateConsensusTrack();
    const restartBtn = document.getElementById("btn-restart-demo");
    if (restartBtn) restartBtn.textContent = this.t("viewer.btnRestart");
    const editBtn = document.getElementById("btn-edit-annotations");
    if (editBtn) editBtn.textContent = this.t("viewer.btnEditAnnotations");
    const finishBtn = document.getElementById("btn-finish-demo");
    if (finishBtn) {
      const span = finishBtn.querySelector("span:not(.hotspot-pulse)");
      if (span) span.textContent = this.t("viewer.btnFinish");
    }

    // Refresh active spotlight popover content in new language if currently visible
    if (this.isSpotlightDarkened && this.currentTourKey) {
      this.showDarkSpotlight(this.currentTourKey);
    }
  }

  updateGuide() {
    const guideEl = document.getElementById("guide-message");
    if (!guideEl) return;
    const t = (k) => this.t(k);

    switch (this.currentStep) {
      case 1:
        if (!this.isRecording && this.elapsedSeconds === 0) {
          guideEl.innerHTML = t("guide.step1Initial");
        } else if (this.isRecording) {
          guideEl.innerHTML = t("guide.step1Recording");
        } else {
          guideEl.innerHTML = t("guide.step1Stopped");
        }
        break;
      case 2:
        guideEl.innerHTML = t("guide.step2");
        break;
      case 3:
        guideEl.innerHTML = t("guide.step3");
        break;
      case 4:
        guideEl.innerHTML = t("guide.step4");
        break;
    }
  }

  // ===========================================================================
  // SPOTLIGHT GUIDED TOUR ENGINE (Smart Escurecimento sem clique)
  // ===========================================================================
  initSpotlight() {
    this.tourEnabled = true;
    this.currentTourKey = "stage1_record";
    this.spotlightIdleTimer = null;
    this.isSpotlightDarkened = false;
    this.spotlightDelayMs = 4200; // 4.2 seconds without clicking action triggers darkening

    this.tourSteps = {
      stage1_record: {
        stage: 1,
        target: "#btn-phone-record",
        stepNum: "1 / 4",
        title_pt: "Iniciar Gravação Móvel",
        title_en: "Start Mobile Acquisition",
        desc_pt: "Clique no botão do smartphone para simular a captura inercial (100 Hz) e gravação de vídeo sincronizada.",
        desc_en: "Click the button on the smartphone to sample 100 Hz inertial sensors synchronized with camera video.",
        preferredPosition: "right",
        actionHint_pt: "👆 Clique em [● Start Recording]",
        actionHint_en: "👆 Click [● Start Recording]"
      },
      stage1_stop: {
        stage: 1,
        target: "#btn-phone-stop",
        stepNum: "1 / 4",
        title_pt: "Finalizar Coleta",
        title_en: "Stop Acquisition",
        desc_pt: "O participante realizou os movimentos VERTICAL e HORIZONTAL. Clique em Parar para salvar os dados no buffer local.",
        desc_en: "The participant executed VERTICAL and HORIZONTAL movements. Click Stop to buffer data locally.",
        preferredPosition: "right",
        actionHint_pt: "👆 Clique em [■ Stop]",
        actionHint_en: "👆 Click [■ Stop]"
      },
      stage1_upload: {
        stage: 1,
        target: "#btn-phone-upload",
        stepNum: "1 / 4",
        title_pt: "Enviar ao Servidor",
        title_en: "Upload & Synchronize",
        desc_pt: "Envie a sessão gravada para o HIAAC-Rec-SyncServer processar e sincronizar os 45 canais.",
        desc_en: "Upload recorded session to HIAAC-Rec-SyncServer to synchronize all 45 sensor channels.",
        preferredPosition: "right",
        actionHint_pt: "👆 Clique em [☁ Enviar ao Servidor]",
        actionHint_en: "👆 Click [☁ Send to Server]"
      },
      stage1_next: {
        stage: 1,
        target: "#stage1-next-btn",
        stepNum: "1 / 4",
        title_pt: "Avançar para Anonimização",
        title_en: "Proceed to Anonymization",
        desc_pt: "Os dados foram sincronizados com sucesso no servidor. Avance para o módulo de mascaramento facial.",
        desc_en: "Data successfully synchronized on server. Proceed to face masking module.",
        preferredPosition: "left",
        actionHint_pt: "👆 Clique para avançar",
        actionHint_en: "👆 Click to advance"
      },
      stage2_style: {
        stage: 2,
        target: "#stage2-mask-style-group",
        stepNum: "2 / 4",
        title_pt: "Estilos de Anonimização Facial",
        title_en: "Privacy Masking Styles",
        desc_pt: "O YOLOv7-tiny ONNX localizou o rosto no vídeo. Você pode escolher entre Desfoque (Blur), Mosaico (Pixelate) ou Preenchimento Preto (Solid Fill).",
        desc_en: "YOLOv7-tiny ONNX located the face in video. You can choose between Blur, Mosaic (Pixelate), or Solid Fill.",
        preferredPosition: "left",
        actionHint_pt: "💡 Informativo: escolha um estilo ou avance para renderizar",
        actionHint_en: "💡 Informative: choose a style or proceed to render",
        btnText_pt: "Próximo ➜",
        btnText_en: "Next ➜",
        nextStepKey: "stage2_render"
      },
      stage2_render: {
        stage: 2,
        target: "#btn-run-masking",
        stepNum: "2 / 4",
        title_pt: "Renderizar Anonimização",
        title_en: "Render Anonymization",
        desc_pt: "O YOLOv7-tiny detectou o rosto no vídeo. Escolha um filtro (Desfoque, Mosaico ou Sólido) e clique para processar a anonimização.",
        desc_en: "YOLOv7-tiny detected the face in video. Choose a filter (Blur, Mosaic, Solid) and click to render anonymization.",
        preferredPosition: "left",
        actionHint_pt: "👆 Clique em [⚡ Renderizar]",
        actionHint_en: "👆 Click [⚡ Render]"
      },
      stage2_next: {
        stage: 2,
        target: "#stage2-next-btn",
        stepNum: "2 / 4",
        title_pt: "Avançar para Anotação",
        title_en: "Proceed to Labeler",
        desc_pt: "O vídeo foi anonimizado com sucesso! Avance para a ferramenta de rotulagem temporal sincronizada.",
        desc_en: "Video successfully anonymized! Proceed to synchronized temporal labeling tool.",
        preferredPosition: "left",
        actionHint_pt: "👆 Clique para avançar",
        actionHint_en: "👆 Click to advance"
      },
      stage3_labels: {
        stage: 3,
        target: "#stage3-activities-group",
        stepNum: "3 / 4",
        title_pt: "Rotulagem de Atividades & Sinais",
        title_en: "Activity Labels & Signals",
        desc_pt: "Selecione VERTICAL ou HORIZONTAL e clique na forma de onda inercial para marcar o início (-1) e fim. Se preferir, use o autofill.",
        desc_en: "Select VERTICAL or HORIZONTAL and click on the inertial waveform to mark start (-1) and end. You can also use quick autofill.",
        preferredPosition: "bottom",
        actionHint_pt: "💡 Marque no gráfico ou veja o preenchimento automático",
        actionHint_en: "💡 Mark on graph or see automatic autofill",
        btnText_pt: "Ver Preenchimento ➜",
        btnText_en: "See Autofill ➜",
        nextStepKey: "stage3_autofill"
      },
      stage3_autofill: {
        stage: 3,
        target: "#btn-autofill-lab1",
        stepNum: "3 / 4",
        title_pt: "Rotulagem de Atividades",
        title_en: "Activity Annotation",
        desc_pt: "Clique no preenchimento rápido das anotações do Lab 1 ou clique diretamente na forma de onda para marcar início e fim.",
        desc_en: "Click to autofill Lab 1 annotations or click directly on the waveform to mark start and end.",
        preferredPosition: "bottom",
        actionHint_pt: "👆 Clique em [✨ Preencher]",
        actionHint_en: "👆 Click [✨ Autofill]"
      },
      stage3_next: {
        stage: 3,
        target: "#stage3-next-btn",
        stepNum: "3 / 4",
        title_pt: "Avançar para o Visualizador",
        title_en: "Proceed to Viewer",
        desc_pt: "Anotações consolidadas! Avance para inspecionar os múltiplos anotadores e analisar o consenso.",
        desc_en: "Annotations recorded! Proceed to inspect multiple annotators and evaluate consensus.",
        preferredPosition: "left",
        actionHint_pt: "👆 Clique para avançar",
        actionHint_en: "👆 Click to advance"
      },
      stage4_consensus: {
        stage: 4,
        target: "#viewer-consensus-select",
        stepNum: "4 / 4",
        title_pt: "Inspeção Multianotador & Consenso",
        title_en: "Inspection & Consensus Modes",
        desc_pt: "O HIAAC-Rec-Viewer sincroniza vídeo, sinal a 100 Hz e compara os 3 anotadores (lab 1, 2 e 3). Teste as regras de consolidação: União, Interseção ou Maioria.",
        desc_en: "The Viewer synchronizes video and 100 Hz signals, comparing annotators (lab 1, 2, and 3). Test consolidation rules: Union, Intersection, or Majority.",
        preferredPosition: "bottom",
        actionHint_pt: "💡 Alterne as estratégias de consenso ou avance para concluir",
        actionHint_en: "💡 Switch consensus strategies or proceed to finish",
        btnText_pt: "Avançar para Finalizar ➜",
        btnText_en: "Proceed to Finish ➜",
        nextStepKey: "stage4_finish"
      },
      stage4_finish: {
        stage: 4,
        target: "#btn-finish-demo",
        stepNum: "4 / 4",
        title_pt: "Concluir e Exportar",
        title_en: "Finish & Export",
        desc_pt: "Ciclo completo verificado! Clique para abrir e baixar o pacote padronizado do dataset para pesquisa.",
        desc_en: "Complete lifecycle verified! Click to inspect and download standardized dataset package.",
        preferredPosition: "top",
        actionHint_pt: "👆 Clique em [Finalizar e Exportar]",
        actionHint_en: "👆 Click [Finish & Export]"
      }
    };

    // Toggle button in header
    const tourToggleBtn = document.getElementById("demo-tour-toggle-btn");
    if (tourToggleBtn) {
      tourToggleBtn.addEventListener("click", () => {
        this.toggleTourMode();
      });
    }

    // Close button in popover
    const popoverCloseBtn = document.getElementById("spotlight-close-btn");
    if (popoverCloseBtn) {
      popoverCloseBtn.addEventListener("click", () => {
        this.advanceInformationalTourKeyOnDismiss();
        this.hideSpotlight(true);
      });
    }

    // Progression button in popover (only displayed for informational steps)
    const skipStepBtn = document.getElementById("spotlight-skip-btn");
    if (skipStepBtn) {
      skipStepBtn.addEventListener("click", () => {
        const stepConfig = this.getTourStepConfig(this.currentTourKey);
        if (stepConfig && stepConfig.nextStepKey) {
          const nextKey = stepConfig.nextStepKey;
          this.advanceInformationalTourKeyOnDismiss();
          this.queueTourStep(nextKey, true);
        } else {
          // Action step or final spotlight: dismiss spotlight cleanly without jumping or restarting demo!
          this.hideSpotlight(true);
        }
      });
    }

    // Clicking dark backdrop layer dismisses darkening
    const layer = document.getElementById("demo-spotlight-layer");
    if (layer) {
      layer.addEventListener("click", (e) => {
        if (e.target === layer) {
          this.advanceInformationalTourKeyOnDismiss();
          this.hideSpotlight(true);
        }
      });
    }

    // Reposition on scroll / resize
    const stageBody = document.querySelector(".demo-stage-body");
    if (stageBody) {
      stageBody.addEventListener("scroll", () => {
        if (this.isSpotlightDarkened && this.currentTourKey) {
          this.repositionSpotlight(this.currentTourKey);
        }
      });
    }

    window.addEventListener("resize", () => {
      if (this.isSpotlightDarkened && this.currentTourKey) {
        this.repositionSpotlight(this.currentTourKey);
      }
    });
  }

  getTourStepConfig(key) {
    return this.tourSteps ? this.tourSteps[key] : null;
  }

  queueTourStep(key, immediate = false) {
    if (!this.tourEnabled) return;
    this.currentTourKey = key;
    const stepConfig = this.getTourStepConfig(key);
    if (!stepConfig) return;

    // Remove any previous target pulse/elevation
    document.querySelectorAll(".spotlight-target-pulse, .spotlight-target-elevated").forEach(el => {
      el.classList.remove("spotlight-target-pulse", "spotlight-target-elevated");
    });

    const targetEl = document.querySelector(stepConfig.target);
    if (!targetEl) return;

    // Subtle beacon on target element immediately
    targetEl.classList.add("spotlight-target-pulse");

    // Hide previous dark spotlight
    this.hideSpotlight(false);

    clearTimeout(this.spotlightIdleTimer);
    clearTimeout(this.spotlightAutoAdvanceTimer);

    if (immediate) {
      this.showDarkSpotlight(key);
    } else {
      // Darkens only if user passes time without clicking action (even if moving mouse!)
      this.spotlightIdleTimer = setTimeout(() => {
        if (this.tourEnabled && this.currentTourKey === key && !this.isSpotlightDarkened) {
          const modalBackdrop = document.getElementById("demo-modal-backdrop");
          if (modalBackdrop && modalBackdrop.classList.contains("open")) {
            this.showDarkSpotlight(key);
          }
        }
      }, this.spotlightDelayMs);
    }
  }

  showDarkSpotlight(key) {
    const stepConfig = this.getTourStepConfig(key);
    if (!stepConfig) return;

    this.currentTourKey = key;

    const targetEl = document.querySelector(stepConfig.target);
    if (!targetEl) return;

    const layer = document.getElementById("demo-spotlight-layer");
    const hole = document.getElementById("spotlight-hole");
    const popover = document.getElementById("spotlight-popover");
    const modalBody = document.querySelector(".demo-modal-body");
    if (!layer || !hole || !popover || !modalBody) return;

    // Scroll target into view if partially hidden
    targetEl.scrollIntoView({ behavior: "auto", block: "nearest", inline: "nearest" });

    // Elevate target above spotlight layer so it's directly clickable
    targetEl.classList.add("spotlight-target-elevated");

    // Populate popover content
    const isPt = window.hiaacI18n && window.hiaacI18n.currentLang === "pt";
    const badge = document.getElementById("spotlight-badge");
    const title = document.getElementById("spotlight-title");
    const desc = document.getElementById("spotlight-desc");
    const hint = document.getElementById("spotlight-hint");

    if (badge) badge.textContent = isPt ? `PASSO ${stepConfig.stepNum}` : `STEP ${stepConfig.stepNum}`;
    if (title) title.textContent = isPt ? stepConfig.title_pt : stepConfig.title_en;
    if (desc) desc.textContent = isPt ? stepConfig.desc_pt : stepConfig.desc_en;
    if (hint) hint.textContent = isPt ? stepConfig.actionHint_pt : stepConfig.actionHint_en;

    const skipBtn = document.getElementById("spotlight-skip-btn");
    if (skipBtn) {
      if (stepConfig.nextStepKey) {
        // Only informational steps show a progression button
        skipBtn.style.display = "inline-flex";
        if (stepConfig.btnText_pt || stepConfig.btnText_en) {
          skipBtn.textContent = isPt ? (stepConfig.btnText_pt || "Próximo ➜") : (stepConfig.btnText_en || "Next ➜");
        } else {
          skipBtn.textContent = isPt ? "Próximo ➜" : "Next ➜";
        }
      } else {
        // Action steps: user must perform the real action; hide skip button!
        skipBtn.style.display = "none";
      }
    }

    clearTimeout(this.spotlightAutoAdvanceTimer);

    if (key === "stage3_labels") {
      this.spotlightAutoAdvanceTimer = setTimeout(() => {
        if (this.currentTourKey === "stage3_labels" && this.isSpotlightDarkened) {
          this.stage3LabelsSeen = true;
          this.showDarkSpotlight("stage3_autofill");
        }
      }, 5500);
    }

    if (key === "stage4_consensus") {
      this.spotlightAutoAdvanceTimer = setTimeout(() => {
        if (this.currentTourKey === "stage4_consensus" && this.isSpotlightDarkened) {
          this.stage4ConsensusSeen = true;
          this.showDarkSpotlight("stage4_finish");
        }
      }, 6000);
    }

    this.repositionSpotlight(key);
    requestAnimationFrame(() => this.repositionSpotlight(key));

    layer.classList.add("active");
    this.isSpotlightDarkened = true;
    const btn = document.getElementById("demo-tour-toggle-btn");
    if (btn) {
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");
    }
  }

  repositionSpotlight(key) {
    const stepConfig = this.getTourStepConfig(key);
    if (!stepConfig) return;

    const targetEl = document.querySelector(stepConfig.target);
    if (!targetEl) return;

    const hole = document.getElementById("spotlight-hole");
    const popover = document.getElementById("spotlight-popover");
    const notch = document.getElementById("spotlight-popover-notch");
    const modalBody = document.querySelector(".demo-modal-body");
    if (!hole || !popover || !modalBody) return;

    const bodyRect = modalBody.getBoundingClientRect();
    const elRect = targetEl.getBoundingClientRect();

    const pad = 8;
    const holeLeft = Math.max(0, elRect.left - bodyRect.left - pad);
    const holeTop = Math.max(0, elRect.top - bodyRect.top - pad);
    const holeWidth = elRect.width + (pad * 2);
    const holeHeight = elRect.height + (pad * 2);

    hole.style.left = `${holeLeft}px`;
    hole.style.top = `${holeTop}px`;
    hole.style.width = `${holeWidth}px`;
    hole.style.height = `${holeHeight}px`;

    const popoverWidth = 320;
    const popoverHeight = 160;
    const pref = stepConfig.preferredPosition || "bottom";

    const spaceRight = bodyRect.width - (holeLeft + holeWidth);
    const spaceLeft = holeLeft;
    const spaceBottom = bodyRect.height - (holeTop + holeHeight);
    const spaceTop = holeTop;

    let pLeft, pTop, notchClass;

    if (pref === "right" && spaceRight >= 300) {
      pLeft = holeLeft + holeWidth + 14;
      pTop = Math.max(12, Math.min(bodyRect.height - popoverHeight - 12, holeTop + (holeHeight / 2) - 50));
      notchClass = "notch-left";
    } else if (pref === "left" && spaceLeft >= 300) {
      pLeft = holeLeft - popoverWidth - 14;
      pTop = Math.max(12, Math.min(bodyRect.height - popoverHeight - 12, holeTop + (holeHeight / 2) - 50));
      notchClass = "notch-right";
    } else if (pref === "top" && spaceTop >= 150) {
      pLeft = Math.max(12, Math.min(bodyRect.width - popoverWidth - 12, holeLeft + (holeWidth / 2) - (popoverWidth / 2)));
      pTop = Math.max(12, holeTop - popoverHeight - 14);
      notchClass = "notch-bottom";
    } else {
      pLeft = Math.max(12, Math.min(bodyRect.width - popoverWidth - 12, holeLeft + (holeWidth / 2) - (popoverWidth / 2)));
      pTop = holeTop + holeHeight + 14;
      notchClass = "notch-top";
    }

    popover.style.left = `${pLeft}px`;
    popover.style.top = `${pTop}px`;

    if (notch) {
      notch.className = `spotlight-popover-notch ${notchClass}`;
    }
  }

  hideSpotlight(clearTimer = true) {
    clearTimeout(this.spotlightAutoAdvanceTimer);
    if (clearTimer) {
      clearTimeout(this.spotlightIdleTimer);
    }
    const layer = document.getElementById("demo-spotlight-layer");
    if (layer) layer.classList.remove("active");
    this.isSpotlightDarkened = false;
    document.querySelectorAll(".spotlight-target-elevated").forEach(el => {
      el.classList.remove("spotlight-target-elevated");
    });
    const btn = document.getElementById("demo-tour-toggle-btn");
    if (btn) {
      btn.classList.remove("active");
      btn.setAttribute("aria-pressed", "false");
    }
  }

  advanceInformationalTourKeyOnDismiss() {
    if (this.currentTourKey === "stage2_style") {
      this.stage2StyleSeen = true;
      this.currentTourKey = "stage2_render";
    } else if (this.currentTourKey === "stage3_labels") {
      this.stage3LabelsSeen = true;
      this.currentTourKey = "stage3_autofill";
    } else if (this.currentTourKey === "stage4_consensus") {
      this.stage4ConsensusSeen = true;
      this.currentTourKey = "stage4_finish";
    }
  }

  getDefaultTourKeyForStep(step) {
    switch (step) {
      case 1:
        if (this.isRecording) return "stage1_stop";
        const uploadBtn = document.getElementById("btn-phone-upload");
        if (uploadBtn && uploadBtn.style.display === "flex") return "stage1_upload";
        const nextBtn1 = document.getElementById("stage1-next-btn");
        if (nextBtn1 && nextBtn1.style.display === "inline-flex") return "stage1_next";
        return "stage1_record";
      case 2:
        if (this.isMaskRendered) return "stage2_next";
        if (this.stage2StyleSeen) return "stage2_render";
        return "stage2_style";
      case 3:
        if (this.userAnnotations && this.userAnnotations.length > 0) return "stage3_next";
        if (this.stage3LabelsSeen) return "stage3_autofill";
        return "stage3_labels";
      case 4:
        if (this.stage4ConsensusSeen) return "stage4_finish";
        return "stage4_consensus";
      default:
        return "stage1_record";
    }
  }

  toggleTourMode() {
    const btn = document.getElementById("demo-tour-toggle-btn");
    if (this.isSpotlightDarkened) {
      // Tour is currently dark -> User clicked to turn off
      this.tourEnabled = false;
      this.advanceInformationalTourKeyOnDismiss();
      this.hideSpotlight(true);
      document.querySelectorAll(".spotlight-target-pulse").forEach(el => el.classList.remove("spotlight-target-pulse"));
      if (btn) {
        btn.classList.remove("active");
        btn.setAttribute("aria-pressed", "false");
      }
    } else {
      // Tour is currently NOT dark -> User clicked to activate/show immediately
      this.tourEnabled = true;
      const key = this.currentTourKey || this.getDefaultTourKeyForStep(this.currentStep);
      this.currentTourKey = key;
      this.showDarkSpotlight(key);
      if (btn) {
        btn.classList.add("active");
        btn.setAttribute("aria-pressed", "true");
      }
    }
  }

  // ===========================================================================
  // STAGE 1: Smartphone Acquisition (HIAAC-Rec-App)
  // ===========================================================================
  setupStage1Phone() {
    const recordBtn = document.getElementById("btn-phone-record");
    const recordingControls = document.getElementById("phone-recording-controls");
    const pauseBtn = document.getElementById("btn-phone-pause");
    const stopBtn = document.getElementById("btn-phone-stop");
    const uploadBtn = document.getElementById("btn-phone-upload");
    const recBadge = document.getElementById("phone-rec-badge");
    const timerDisplay = document.getElementById("phone-rec-timer");
    const phoneVideo = document.getElementById("phone-camera-video");
    const nextBtn = document.getElementById("stage1-next-btn");

    if (recordBtn) {
      recordBtn.addEventListener("click", () => {
        this.isRecording = true;
        this.isPaused = false;
        this.hasCompletedCycle = false;
        recordBtn.style.display = "none";

        if (recordingControls) recordingControls.style.display = "flex";
        if (recBadge) recBadge.style.display = "inline-flex";

        if (phoneVideo) {
          phoneVideo.currentTime = 0;
          phoneVideo.play().catch(() => {});
        }

        this.elapsedSeconds = 0;
        clearInterval(this.recordTimer);
        this.recordTimer = setInterval(() => {
          if (!this.isPaused) {
            this.elapsedSeconds++;
            const mm = String(Math.floor(this.elapsedSeconds / 60)).padStart(2, "0");
            const ss = String(this.elapsedSeconds % 60).padStart(2, "0");
            if (timerDisplay) timerDisplay.textContent = `${mm}:${ss}`;
          }
        }, 1000);

        this.logPhoneEvent(this.t("phone.logStart"));
        this.updateGuide();
        this.queueTourStep("stage1_stop");
      });
    }

    if (phoneVideo) {
      phoneVideo.addEventListener("timeupdate", () => {
        // When video passes 22s or loops, user has witnessed both Vertical and Horizontal
        if (phoneVideo.currentTime >= 22.0) {
          this.hasCompletedCycle = true;
        }
      });
    }

    if (pauseBtn) {
      pauseBtn.addEventListener("click", () => {
        if (!this.isPaused) {
          this.isPaused = true;
          if (phoneVideo) phoneVideo.pause();
          pauseBtn.textContent = this.t("phone.btnResume");
          this.logPhoneEvent(this.t("phone.logPause"));
        } else {
          this.isPaused = false;
          if (phoneVideo) phoneVideo.play().catch(() => {});
          pauseBtn.textContent = this.t("phone.btnPause");
          this.logPhoneEvent(this.t("phone.logResume"));
        }
      });
    }

    if (stopBtn) {
      stopBtn.addEventListener("click", () => {
        this.hasCompletedCycle = true;
        // Finalize recording
        this.isRecording = false;
        clearInterval(this.recordTimer);
        if (phoneVideo) phoneVideo.pause();

        // Hide pause and stop controls completely, reveal ONLY upload button
        if (recordingControls) recordingControls.style.display = "none";
        if (recBadge) recBadge.style.display = "none";

        if (uploadBtn) {
          uploadBtn.style.display = "flex";
          uploadBtn.classList.add("hotspot-target");
        }

        this.logPhoneEvent(this.t("phone.logStop"));
        this.updateGuide();
        this.queueTourStep("stage1_upload");
      });
    }


    if (uploadBtn) {
      uploadBtn.addEventListener("click", () => {
        uploadBtn.disabled = true;
        uploadBtn.innerHTML = `<span>${this.t("phone.btnUploading")}</span>`;

        this.logPhoneEvent(this.t("phone.logPack"));

        setTimeout(() => {
          this.logPhoneEvent(this.t("phone.logTx"));
        }, 600);

        setTimeout(() => {
          this.logPhoneEvent(this.t("phone.logSuccess"));
          uploadBtn.innerHTML = `<span>${this.t("phone.btnUploaded")}</span>`;
          uploadBtn.style.background = "var(--sage-hi)";
          uploadBtn.classList.remove("hotspot-target");

          this.markStepCompleted(1);
          if (nextBtn) {
            nextBtn.style.display = "inline-flex";
            nextBtn.classList.add("hotspot-target");
          }
          this.queueTourStep("stage1_next");
        }, 1500);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        this.goToStep(2);
      });
    }

    this.startPhoneWaveform();
  }

  logPhoneEvent(msg) {
    const logEl = document.getElementById("phone-event-log");
    if (!logEl) return;
    const time = new Date().toLocaleTimeString();
    const line = document.createElement("div");
    line.style.marginBottom = "3px";
    line.innerHTML = `<span style="color:var(--ink-3)">[${time}]</span> ${msg}`;
    logEl.appendChild(line);
    logEl.scrollTop = logEl.scrollHeight;
  }

  startPhoneWaveform() {
    const canvas = document.getElementById("phone-signal-canvas");
    const phoneVideo = document.getElementById("phone-camera-video");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Baseline
      ctx.strokeStyle = "rgba(128,128,128,0.2)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.stroke();

      const data = window.HIAAC_MOCK_DATA?.accelerometer;
      if (data && data.length > 0) {
        const curTime = (phoneVideo && !phoneVideo.paused) ? phoneVideo.currentTime : (this.elapsedSeconds % 24.0);
        // Window of 2.5 seconds centered or trailing at curTime
        const windowSec = 2.5;
        const startTime = Math.max(0, curTime - windowSec);
        const endTime = startTime + windowSec;

        const slice = data.filter((d) => d.t >= startTime && d.t <= endTime);

        if (slice.length > 1) {
          const drawChannel = (key, color, scale, offset = 0) => {
            ctx.strokeStyle = color;
            ctx.lineWidth = 1.3;
            ctx.beginPath();
            slice.forEach((pt, i) => {
              const x = ((pt.t - startTime) / windowSec) * w;
              const y = h / 2 - (pt[key] - offset) * scale;
              if (i === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            });
            ctx.stroke();
          };

          // Draw X (Red/Orange), Y (Green/Cyan), Z (Indigo - offset gravity 9.8)
          drawChannel("x", "#ff9d1c", 2.2);
          drawChannel("y", "#38bdf8", 2.0);
          drawChannel("z", "#a855f7", 1.8, 9.8);
        }
      }

      this.phoneAnimId = requestAnimationFrame(render);
    };

    if (this.phoneAnimId) cancelAnimationFrame(this.phoneAnimId);
    this.phoneAnimId = requestAnimationFrame(render);
  }

  stopPhoneWaveform() {
    if (this.phoneAnimId) {
      cancelAnimationFrame(this.phoneAnimId);
      this.phoneAnimId = null;
    }
  }

  // ===========================================================================
  // STAGE 2: Face Masking Studio (Default Fixed Params & Anonymization Render)
  // ===========================================================================
  setupStage2Masking() {
    const video = document.getElementById("studio-video");
    const faceBox = document.getElementById("face-box-overlay");
    const runBtn = document.getElementById("btn-run-masking");
    const successMsg = document.getElementById("masking-success-msg");
    const nextBtn = document.getElementById("stage2-next-btn");
    const maskPills = document.querySelectorAll(".radio-pill[data-mask]");

    // Pill selectors
    maskPills.forEach((pill) => {
      pill.addEventListener("click", () => {
        maskPills.forEach((p) => p.classList.remove("active"));
        pill.classList.add("active");
        this.maskStyle = pill.dataset.mask;

        // Update target rendered video path
        if (this.maskStyle === "blur") {
          this.renderedVideoSrc = "assets/videos/eval02_masked_blur.mp4";
        } else if (this.maskStyle === "pixelate") {
          this.renderedVideoSrc = "assets/videos/eval02_masked_pixelate.mp4";
        } else {
          this.renderedVideoSrc = "assets/videos/eval02_masked_solid.mp4";
        }

        const isEn = !window.hiaacI18n || window.hiaacI18n.currentLang === "en";
        const styleName = this.maskStyle === "blur" 
          ? (isEn ? "Blur" : "Desfoque") 
          : this.maskStyle === "pixelate" 
            ? (isEn ? "Mosaic" : "Mosaico") 
            : (isEn ? "Solid Fill" : "Preto Sólido");

        if (this.isMaskRendered) {
          // Immediately update video preview in Step 2 to the newly chosen mask
          if (video) {
            const curTime = video.currentTime;
            video.src = this.renderedVideoSrc;
            video.currentTime = curTime;
            video.play().catch(() => {});
          }
          if (faceBox) {
            faceBox.style.display = "none";
          }

          // Propagate new masked video to downstream tools (labeler & viewer)
          const annoVid = document.getElementById("anno-video");
          if (annoVid) annoVid.src = this.renderedVideoSrc;
          const viewerVid = document.getElementById("viewer-video");
          if (viewerVid) viewerVid.src = this.renderedVideoSrc;

          if (runBtn) {
            runBtn.disabled = false;
            runBtn.style.background = "var(--sage-hi)";
            runBtn.innerHTML = `<span>✓ ${isEn ? `${styleName} Mask Active` : `Máscara ${styleName} Ativa`}</span>`;
          }

          this.logStudioConsole(isEn 
            ? `[Privacy] Filter switched to ${styleName}. Synchronized with Labeler & Viewer.` 
            : `[Privacidade] Filtro alterado para ${styleName}. Sincronizado com Labeler & Viewer.`);
        } else {
          if (runBtn) {
            runBtn.innerHTML = `<span>⚡ ${isEn ? "Render Anonymization" : "Renderizar Anonimização"} (${styleName.toUpperCase()})</span>`;
          }
        }

        this.stage2StyleSeen = true;
        this.currentTourKey = "stage2_render";
        if (this.isSpotlightDarkened) {
          this.showDarkSpotlight("stage2_render");
        }

        this.updateDownloadPackage();
      });
    });

    // Dynamic Frame-by-Frame Tracking of Face Bounding Box (Face Masking Studio)
    const masks = (window.HIAAC_MOCK_DATA && window.HIAAC_MOCK_DATA.masks) || [];
    let isDragging = false;
    let startX = 0, startY = 0;
    let initLeft = 0, initTop = 0;

    const updateTrackingBox = () => {
      if (this.isMaskRendered || isDragging || !faceBox || !video) return;
      const cur = video.currentTime || 0;
      const idx = Math.min(masks.length - 1, Math.max(0, Math.floor(cur * 10)));
      const box = masks[idx];
      if (box && box.visible !== false) {
        faceBox.style.display = "block";
        faceBox.style.left = `${box.x}%`;
        faceBox.style.top = `${box.y}%`;
        faceBox.style.width = `${box.w}%`;
        faceBox.style.height = `${box.h}%`;
      } else {
        faceBox.style.display = "none";
      }
    };

    if (video) {
      video.addEventListener("timeupdate", updateTrackingBox);
      const trackingLoop = () => {
        if (!this.isMaskRendered && this.currentStep === 2 && !video.paused) {
          updateTrackingBox();
        }
        requestAnimationFrame(trackingLoop);
      };
      requestAnimationFrame(trackingLoop);
    }

    // Draggable Bounding Box (Fine-tuning)
    if (faceBox) {
      faceBox.addEventListener("mousedown", (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        const rect = faceBox.getBoundingClientRect();
        const parentRect = faceBox.parentElement.getBoundingClientRect();
        initLeft = rect.left - parentRect.left;
        initTop = rect.top - parentRect.top;
        e.preventDefault();
      });

      window.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        const parentRect = faceBox.parentElement.getBoundingClientRect();
        const newLeft = Math.max(0, Math.min(parentRect.width - faceBox.offsetWidth, initLeft + dx));
        const newTop = Math.max(0, Math.min(parentRect.height - faceBox.offsetHeight, initTop + dy));
        faceBox.style.left = `${(newLeft / parentRect.width) * 100}%`;
        faceBox.style.top = `${(newTop / parentRect.height) * 100}%`;
      });

      window.addEventListener("mouseup", () => {
        if (isDragging) {
          isDragging = false;
        }
      });
    }

    // Render Anonymization Button
    if (runBtn) {
      runBtn.addEventListener("click", () => {
        runBtn.disabled = true;
        const isEn = !window.hiaacI18n || window.hiaacI18n.currentLang === "en";
        const styleName = this.maskStyle === "blur" 
          ? (isEn ? "Blur" : "Desfoque") 
          : this.maskStyle === "pixelate" 
            ? (isEn ? "Mosaic" : "Mosaico") 
            : (isEn ? "Solid Mask" : "Preto Sólido");

        runBtn.innerHTML = `<span>${this.t("mask.btnRendering")} (${styleName.toUpperCase()})...</span>`;
        this.logStudioConsole(this.t("mask.logRender").replace("{style}", styleName));

        setTimeout(() => {
          this.logStudioConsole(this.t("mask.logFfmpeg"));
        }, 500);

        setTimeout(() => {
          this.logStudioConsole(this.t("mask.logSuccess").replace("{style}", styleName));
          runBtn.disabled = false;
          runBtn.innerHTML = `<span>✓ ${isEn ? `${styleName} Mask Applied` : `Máscara ${styleName} Aplicada`}</span>`;
          runBtn.style.background = "var(--sage-hi)";
          runBtn.classList.remove("hotspot-target");

          this.isMaskRendered = true;

          // Switch video element source to the rendered clip
          if (video) {
            const curTime = video.currentTime;
            video.src = this.renderedVideoSrc;
            video.currentTime = curTime;
            video.play().catch(() => {});
          }

          // Propagate to downstream tools (labeler & viewer)
          const annoVid = document.getElementById("anno-video");
          if (annoVid) annoVid.src = this.renderedVideoSrc;
          const viewerVid = document.getElementById("viewer-video");
          if (viewerVid) viewerVid.src = this.renderedVideoSrc;

          // Hide draggable box to show clean rendered video
          if (faceBox) {
            faceBox.style.display = "none";
          }

          if (successMsg) successMsg.style.display = "block";
          if (nextBtn) {
            nextBtn.style.display = "inline-flex";
            nextBtn.classList.add("hotspot-target");
          }

          this.markStepCompleted(2);
          this.updateDownloadPackage();
          this.queueTourStep("stage2_next");
        }, 1200);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        this.goToStep(3);
      });
    }
  }

  logStudioConsole(msg) {
    const term = document.getElementById("studio-terminal");
    if (!term) return;
    const div = document.createElement("div");
    div.style.marginBottom = "2px";
    div.textContent = msg;
    term.appendChild(div);
    term.scrollTop = term.scrollHeight;
  }

  // ===========================================================================
  // STAGE 3: Authentic Annotation Interface (HIAAC-Rec-Labeler)
  // ===========================================================================
  setupStage3Labeler() {
    const playBtn = document.getElementById("anno-play-btn");
    const video = document.getElementById("anno-video");
    const scrubberSlider = document.getElementById("anno-scrubber-slider");
    const timeDisplay = document.getElementById("anno-time-display");
    const canvas = document.getElementById("anno-waveform-canvas");
    const scrubberLine = document.getElementById("anno-scrubber-line");
    const autofillBtn = document.getElementById("btn-autofill-lab1");
    const resetBtn = document.getElementById("btn-reset-labeler");
    const nextBtn = document.getElementById("stage3-next-btn");
    const activityBtns = document.querySelectorAll(".btn-label-activity");
    const instructionBox = document.getElementById("anno-step-instruction");

    // Activity selector
    activityBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        activityBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        this.selectedActivity = btn.dataset.activity;
        this.currentPendingStart = null;
        this.stage3LabelsSeen = true;
        this.currentTourKey = "stage3_autofill";
        if (this.isSpotlightDarkened) {
          this.showDarkSpotlight("stage3_autofill");
        }
        if (instructionBox) {
          instructionBox.innerHTML = this.t("labeler.selectedActivityPrompt").replace("{activity}", this.selectedActivity);
        }
        this.drawAnnoWaveform();
      });
    });

    // Play/Pause Video
    if (playBtn && video) {
      playBtn.addEventListener("click", () => {
        if (video.paused) {
          video.play().catch(() => {});
          playBtn.textContent = "⏸";
          this.isAnnoPlaying = true;
        } else {
          video.pause();
          playBtn.textContent = "▶";
          this.isAnnoPlaying = false;
        }
      });

      video.addEventListener("timeupdate", () => {
        const cur = video.currentTime;
        if (scrubberSlider) scrubberSlider.value = cur;
        if (timeDisplay) {
          const m = String(Math.floor(cur / 60)).padStart(2, "0");
          const s = (cur % 60).toFixed(1).padStart(4, "0");
          timeDisplay.textContent = `${m}:${s} / 00:24.0`;
        }
        if (scrubberLine) {
          const pct = (cur / this.totalDuration) * 100;
          scrubberLine.style.left = `${pct}%`;
        }
      });
    }

    // Range slider scrubbing
    if (scrubberSlider && video) {
      scrubberSlider.addEventListener("input", () => {
        const t = parseFloat(scrubberSlider.value);
        video.currentTime = t;
        if (scrubberLine) {
          scrubberLine.style.left = `${(t / this.totalDuration) * 100}%`;
        }
      });
    }

    // Canvas click: dropping -1 and activity end points
    if (canvas && video) {
      canvas.addEventListener("click", (e) => {
        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const pct = Math.max(0, Math.min(1, clickX / rect.width));
        const clickTime = pct * this.totalDuration;

        // Seek video
        video.currentTime = clickTime;

        if (!this.currentPendingStart) {
          // Drop Start Point (-1)
          this.currentPendingStart = { t: clickTime, activity: this.selectedActivity };
          if (instructionBox) {
            instructionBox.innerHTML = this.t("labeler.markedStartPrompt")
              .replace("{time}", clickTime.toFixed(2))
              .replace("{activity}", this.selectedActivity);
          }
          this.drawAnnoWaveform();
        } else {
          // Drop End Point (activity name)
          let t1 = this.currentPendingStart.t;
          let t2 = clickTime;
          if (t1 > t2) [t1, t2] = [t2, t1];

          const color = this.selectedActivity === "VERTICAL" ? "#ff9d1c" : "#38bdf8";
          this.userAnnotations.push({
            start: t1,
            end: t2,
            label: this.selectedActivity,
            color: color
          });

          if (instructionBox) {
            instructionBox.innerHTML = this.t("labeler.markedEndPrompt")
              .replace("{activity}", this.selectedActivity)
              .replace("{start}", t1.toFixed(2))
              .replace("{end}", t2.toFixed(2));
          }

          this.currentPendingStart = null;
          this.updateAnnoTable();
          this.drawAnnoWaveform();

          if (nextBtn) {
            nextBtn.style.display = "inline-flex";
            nextBtn.classList.add("hotspot-target");
          }
          this.queueTourStep("stage3_next");
        }
      });
    }

    // Autofill Lab 1 Button
    if (autofillBtn) {
      autofillBtn.addEventListener("click", () => {
        this.stage3LabelsSeen = true;
        this.userAnnotations = [
          { start: 1.60, end: 11.00, label: "VERTICAL", color: "#ff9d1c" },
          { start: 13.00, end: 23.00, label: "HORIZONTAL", color: "#38bdf8" }
        ];
        this.currentPendingStart = null;
        if (instructionBox) {
          instructionBox.innerHTML = `✨ <strong>lab 1:</strong> VERTICAL (1.60s - 11.00s) &amp; HORIZONTAL (13.00s - 23.00s).`;
        }
        this.updateAnnoTable();
        this.drawAnnoWaveform();

        if (nextBtn) {
          nextBtn.style.display = "inline-flex";
          nextBtn.classList.add("hotspot-target");
        }
        this.queueTourStep("stage3_next");
      });
    }

    // Reset / Clear Annotations Button
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        this.userAnnotations = [];
        this.currentPendingStart = null;
        if (instructionBox) {
          instructionBox.innerHTML = this.t("labeler.promptDefault");
        }
        this.updateAnnoTable();
        this.drawAnnoWaveform();

        if (nextBtn) {
          nextBtn.style.display = "none";
          nextBtn.classList.remove("hotspot-target");
        }
        this.queueTourStep("stage3_autofill");
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        this.markStepCompleted(3);
        this.goToStep(4);
      });
    }
  }

  updateAnnoTable() {
    const tbody = document.getElementById("anno-table-body");
    if (!tbody) return;

    if (this.userAnnotations.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:var(--ink-3);">${this.t("labeler.emptyState")}</td></tr>`;
      return;
    }

    const startTag = this.t("labeler.tagStart");
    let rowsHtml = "";
    this.userAnnotations.forEach((item) => {
      rowsHtml += `
        <tr>
          <td><strong>${item.start.toFixed(3)}</strong></td>
          <td style="color:var(--ink-2);">${startTag}</td>
          <td>${item.label}_START</td>
          <td>Accelerometer_Right Hand</td>
        </tr>
        <tr style="background:color-mix(in srgb, ${item.color} 10%, transparent);">
          <td><strong>${item.end.toFixed(3)}</strong></td>
          <td style="color:${item.color}; font-weight:700;">${item.label}</td>
          <td>${item.label}_END</td>
          <td>Accelerometer_Right Hand</td>
        </tr>
      `;
    });
    tbody.innerHTML = rowsHtml;
  }

  drawAnnoWaveform() {
    const canvas = document.getElementById("anno-waveform-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Draw user annotations intervals
    this.userAnnotations.forEach((inv) => {
      const x1 = (inv.start / this.totalDuration) * w;
      const x2 = (inv.end / this.totalDuration) * w;

      ctx.fillStyle = inv.color + "28"; // Semi-transparent
      ctx.fillRect(x1, 0, x2 - x1, h);

      ctx.strokeStyle = inv.color;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x1, 0, x2 - x1, h);

      ctx.fillStyle = inv.color;
      ctx.font = "bold 11px 'JetBrains Mono', monospace";
      ctx.fillText(inv.label, x1 + 6, 18);
    });

    // Draw pending start point line
    if (this.currentPendingStart) {
      const px = (this.currentPendingStart.t / this.totalDuration) * w;
      ctx.strokeStyle = "#ff4444";
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(px, 0);
      ctx.lineTo(px, h);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "#ff4444";
      ctx.font = "bold 10px monospace";
      ctx.fillText(this.t("labeler.tagStart"), px + 4, h - 8);
    }

    // Accelerometer timeseries (eval [all] [02])
    const data = window.HIAAC_MOCK_DATA?.accelerometer;
    if (data && data.length > 0) {
      const count = data.length;

      // X Channel (Orange)
      ctx.strokeStyle = "#ff9d1c";
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      for (let i = 0; i < count; i += 2) {
        const x = (data[i].t / this.totalDuration) * w;
        const y = h / 2 - data[i].x * 3.5;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Y Channel (Cyan)
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      for (let i = 0; i < count; i += 2) {
        const x = (data[i].t / this.totalDuration) * w;
        const y = h / 2 - data[i].y * 3.5;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Z Channel (Purple - offset gravity 9.8)
      ctx.strokeStyle = "#a855f7";
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      for (let i = 0; i < count; i += 2) {
        const x = (data[i].t / this.totalDuration) * w;
        const y = h / 2 - (data[i].z - 9.8) * 3.5;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }

  // ===========================================================================
  // STAGE 4: Authentic Multi-Annotator Viewer & Consensus (HIAAC-Rec-Viewer)
  // ===========================================================================
  setupStage4Viewer() {
    const playBtn = document.getElementById("viewer-play-btn");
    const video = document.getElementById("viewer-video");
    const scrubberSlider = document.getElementById("viewer-scrubber-slider");
    const timeDisplay = document.getElementById("viewer-time-display");
    const scrubberLine = document.getElementById("viewer-scrubber-line");
    const canvas = document.getElementById("viewer-waveform-canvas");
    const timelineStage = document.getElementById("viewer-timeline-stage");
    const restartBtn = document.getElementById("btn-restart-demo");
    const editBtn = document.getElementById("btn-edit-annotations");
    const finishBtn = document.getElementById("btn-finish-demo");
    const consensusPills = document.querySelectorAll(".consensus-mode-pill");

    // Annotator Checkboxes
    const chkLab1 = document.getElementById("chk-lab1");
    const chkLab2 = document.getElementById("chk-lab2");
    const chkLab3 = document.getElementById("chk-lab3");

    const updateCheckboxes = () => {
      this.activeAnnotators.lab1 = chkLab1 ? chkLab1.checked : true;
      this.activeAnnotators.lab2 = chkLab2 ? chkLab2.checked : true;
      this.activeAnnotators.lab3 = chkLab3 ? chkLab3.checked : true;

      const row1 = document.getElementById("row-track-lab1");
      const row2 = document.getElementById("row-track-lab2");
      const row3 = document.getElementById("row-track-lab3");

      if (row1) row1.style.display = this.activeAnnotators.lab1 ? "grid" : "none";
      if (row2) row2.style.display = this.activeAnnotators.lab2 ? "grid" : "none";
      if (row3) row3.style.display = this.activeAnnotators.lab3 ? "grid" : "none";

      this.updateConsensusTrack();
      this.updateViewerScrubber(video ? video.currentTime : 0);
    };

    if (chkLab1) chkLab1.addEventListener("change", updateCheckboxes);
    if (chkLab2) chkLab2.addEventListener("change", updateCheckboxes);
    if (chkLab3) chkLab3.addEventListener("change", updateCheckboxes);

    // Consensus Mode Pills
    consensusPills.forEach((pill) => {
      pill.addEventListener("click", () => {
        consensusPills.forEach((p) => p.classList.remove("active"));
        pill.classList.add("active");
        this.viewerConsensusMode = pill.dataset.mode;
        this.stage4ConsensusSeen = true;
        this.currentTourKey = "stage4_finish";
        if (this.isSpotlightDarkened) {
          this.showDarkSpotlight("stage4_finish");
        }
        this.updateConsensusTrack();
      });
    });

    // Consolidation Help Tooltip Toggle (for touch/click)
    const helpBtn = document.getElementById("viewer-help-btn");
    const tooltipWrapper = document.getElementById("viewer-tooltip-wrapper");
    if (helpBtn && tooltipWrapper) {
      helpBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        tooltipWrapper.classList.toggle("is-open");
      });
      document.addEventListener("click", (e) => {
        if (!tooltipWrapper.contains(e.target)) {
          tooltipWrapper.classList.remove("is-open");
        }
      });
    }

    // Play/Pause
    if (playBtn && video) {
      playBtn.addEventListener("click", () => {
        if (video.paused) {
          video.play().catch(() => {});
          playBtn.textContent = "⏸";
          this.isViewerPlaying = true;
        } else {
          video.pause();
          playBtn.textContent = "▶";
          this.isViewerPlaying = false;
        }
      });

      video.addEventListener("timeupdate", () => {
        const cur = video.currentTime;
        if (scrubberSlider) scrubberSlider.value = cur;
        if (timeDisplay) {
          const m = String(Math.floor(cur / 60)).padStart(2, "0");
          const s = (cur % 60).toFixed(1).padStart(4, "0");
          timeDisplay.textContent = `${m}:${s} / 00:24.0`;
        }
        this.updateViewerScrubber(cur);
      });
    }

    // Slider Scrubber
    if (scrubberSlider && video) {
      scrubberSlider.addEventListener("input", () => {
        const t = parseFloat(scrubberSlider.value);
        video.currentTime = t;
        this.updateViewerScrubber(t);
      });
    }

    // Interactive timeline seeking across all synchronized tracks
    const seekTimelineAtEvent = (e) => {
      const rightCell = document.getElementById("viewer-waveform-box") || document.getElementById("lane-annotator-lab1");
      if (!rightCell || !video) return;
      const rect = rightCell.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const pct = Math.max(0, Math.min(1, clickX / rect.width));
      const clickTime = pct * this.totalDuration;
      video.currentTime = clickTime;
      if (scrubberSlider) scrubberSlider.value = clickTime;
      this.updateViewerScrubber(clickTime);
    };

    const interactiveCells = [
      document.getElementById("viewer-waveform-box"),
      document.getElementById("lane-annotator-lab1"),
      document.getElementById("lane-annotator-lab2"),
      document.getElementById("lane-annotator-lab3"),
      document.getElementById("lane-consensus")
    ];
    interactiveCells.forEach((cell) => {
      if (cell) cell.addEventListener("click", seekTimelineAtEvent);
    });

    // Navigation Buttons: Restart, Edit Annotations, and Finish
    if (restartBtn) {
      restartBtn.addEventListener("click", () => {
        this.stage2StyleSeen = false;
        this.stage3LabelsSeen = false;
        this.stage4ConsensusSeen = false;
        this.isRecording = false;
        this.isPaused = false;
        this.hasCompletedCycle = false;
        this.elapsedSeconds = 0;
        clearInterval(this.recordTimer);

        const recordBtn = document.getElementById("btn-phone-record");
        if (recordBtn) recordBtn.style.display = "inline-flex";
        const recordingControls = document.getElementById("phone-recording-controls");
        if (recordingControls) recordingControls.style.display = "none";
        const uploadBtn = document.getElementById("btn-phone-upload");
        if (uploadBtn) {
          uploadBtn.style.display = "none";
          uploadBtn.disabled = false;
        }
        const s1Next = document.getElementById("stage1-next-btn");
        if (s1Next) s1Next.style.display = "none";
        const recBadge = document.getElementById("phone-rec-badge");
        if (recBadge) recBadge.style.display = "none";
        const timerDisplay = document.getElementById("phone-rec-timer");
        if (timerDisplay) timerDisplay.textContent = "00:00";

        this.goToStep(1);
      });
    }

    if (editBtn) {
      editBtn.addEventListener("click", () => {
        this.goToStep(3);
      });
    }

    if (finishBtn) {
      finishBtn.addEventListener("click", () => {
        this.hideSpotlight(true);
        this.updateDownloadPackage();
        const modal = document.getElementById("download-modal");
        if (modal) modal.classList.add("open");
      });
    }

    this.updateDownloadPackage();
    this.renderViewerTracks();
    this.drawViewerWaveform();
    this.updateViewerScrubber(0);
  }

  updateViewerScrubber(curTime) {
    const scrubber = document.getElementById("viewer-scrubber-line");
    const badge = document.getElementById("scrubber-badge");
    const rightCell = document.getElementById("viewer-waveform-box") || document.getElementById("lane-annotator-lab1");
    const container = document.getElementById("viewer-timeline-container");
    if (!scrubber || !rightCell || !container) return;

    const rightRect = rightCell.getBoundingClientRect();
    const contRect = container.getBoundingClientRect();
    const leftOffset = rightRect.left - contRect.left;
    const width = rightRect.width;

    if (width <= 0) return;

    const pct = Math.max(0, Math.min(1, curTime / this.totalDuration));
    const x = leftOffset + pct * width;
    scrubber.style.left = `${x}px`;

    if (badge) {
      const m = String(Math.floor(curTime / 60)).padStart(2, "0");
      const s = (curTime % 60).toFixed(1).padStart(4, "0");
      badge.textContent = `${m}:${s}`;
    }
  }

  updateDownloadPackage() {
    const style = this.maskStyle || "blur";

    // Update file tree in modal to reflect user's chosen mask and consensus
    const rootNameEl = document.getElementById("pkg-tree-root-name");
    if (rootNameEl) {
      rootNameEl.textContent = `eval_all_02_dataset_${style}.zip`;
    }
    const vidTreeEl = document.getElementById("pkg-tree-video-name");
    if (vidTreeEl) {
      vidTreeEl.textContent = `eval [all] [02]_masked_${style}.mp4`;
    }
    const annTreeEl = document.getElementById("pkg-tree-ann-name");
    if (annTreeEl) {
      const mode = this.viewerConsensusMode || "union";
      annTreeEl.textContent = `eval [all] [02]_Ann_consensus_${mode}.csv`;
    }
  }

  getLab1Intervals() {
    if (this.userAnnotations && this.userAnnotations.length > 0) {
      return [...this.userAnnotations].sort((a, b) => a.start - b.start);
    }
    return window.HIAAC_MOCK_DATA?.annotators?.lab1 || [];
  }

  calculateConsensus(activeStreams, mode = "union") {
    if (!activeStreams || activeStreams.length === 0) return [];
    const N = activeStreams.length;
    if (N === 1) {
      return activeStreams[0].map(inv => ({ ...inv }));
    }

    const activities = ["VERTICAL", "HORIZONTAL"];
    const result = [];

    activities.forEach((act) => {
      const streamsForAct = activeStreams.map((stream) =>
        stream.filter((inv) => inv.label === act)
      );

      const pointsSet = new Set();
      streamsForAct.forEach((stream) => {
        stream.forEach((inv) => {
          pointsSet.add(inv.start);
          pointsSet.add(inv.end);
        });
      });

      const points = Array.from(pointsSet).sort((a, b) => a - b);
      if (points.length < 2) return;

      const activeSegments = [];
      for (let i = 0; i < points.length - 1; i++) {
        const p1 = points[i];
        const p2 = points[i + 1];
        if (p2 - p1 < 0.01) continue;
        const mid = (p1 + p2) / 2;

        let count = 0;
        streamsForAct.forEach((stream) => {
          if (stream.some((inv) => inv.start <= mid && inv.end >= mid)) {
            count++;
          }
        });

        let included = false;
        if (mode === "union") {
          included = count >= 1;
        } else if (mode === "intersection") {
          included = count === N;
        } else if (mode === "majority") {
          const threshold = Math.ceil((N + 1) / 2);
          included = count >= threshold;
        }

        if (included) {
          activeSegments.push({ start: p1, end: p2 });
        }
      }

      if (activeSegments.length > 0) {
        let cur = { start: activeSegments[0].start, end: activeSegments[0].end };
        for (let j = 1; j < activeSegments.length; j++) {
          const seg = activeSegments[j];
          if (Math.abs(seg.start - cur.end) < 0.02) {
            cur.end = seg.end;
          } else {
            result.push({
              start: parseFloat(cur.start.toFixed(2)),
              end: parseFloat(cur.end.toFixed(2)),
              label: act
            });
            cur = { start: seg.start, end: seg.end };
          }
        }
        result.push({
          start: parseFloat(cur.start.toFixed(2)),
          end: parseFloat(cur.end.toFixed(2)),
          label: act
        });
      }
    });

    return result.sort((a, b) => a.start - b.start);
  }

  renderViewerTracks() {
    const lab1Data = this.getLab1Intervals();
    const lab2Data = window.HIAAC_MOCK_DATA?.annotators?.lab2 || [];
    const lab3Data = window.HIAAC_MOCK_DATA?.annotators?.lab3 || [];

    // Render individual lanes
    const renderLane = (laneId, intervals) => {
      const lane = document.getElementById(laneId);
      if (!lane) return;
      lane.innerHTML = "";
      intervals.forEach((inv) => {
        const startPct = (inv.start / this.totalDuration) * 100;
        const widthPct = ((inv.end - inv.start) / this.totalDuration) * 100;
        const color = inv.label === "VERTICAL" ? "#ff9d1c" : "#38bdf8";

        const block = document.createElement("div");
        block.className = "interval-block";
        block.style.position = "absolute";
        block.style.left = `${startPct}%`;
        block.style.width = `${widthPct}%`;
        block.style.background = color;
        block.textContent = `${inv.label} (${inv.start.toFixed(1)}s - ${inv.end.toFixed(1)}s)`;
        lane.appendChild(block);
      });
    };

    renderLane("lane-annotator-lab1", lab1Data);
    renderLane("lane-annotator-lab2", lab2Data);
    renderLane("lane-annotator-lab3", lab3Data);

    this.updateConsensusTrack();
  }

  updateConsensusTrack() {
    const lane = document.getElementById("lane-consensus");
    const titleEl = document.getElementById("consensus-track-title");
    if (!lane) return;

    lane.innerHTML = "";

    const activeStreams = [];
    if (this.activeAnnotators.lab1) activeStreams.push(this.getLab1Intervals());
    if (this.activeAnnotators.lab2) activeStreams.push(window.HIAAC_MOCK_DATA?.annotators?.lab2 || []);
    if (this.activeAnnotators.lab3) activeStreams.push(window.HIAAC_MOCK_DATA?.annotators?.lab3 || []);

    const isEn = !window.hiaacI18n || window.hiaacI18n.currentLang === "en";
    let modeName = isEn ? "Union" : "União";
    if (this.viewerConsensusMode === "intersection") {
      modeName = isEn ? "Intersection" : "Intersecção";
    } else if (this.viewerConsensusMode === "majority") {
      modeName = isEn ? "Majority" : "Maioria";
    }

    if (activeStreams.length === 0) {
      if (titleEl) {
        titleEl.textContent = `${isEn ? "Consensus Track" : "Trilha de Consenso"} (${isEn ? "None Selected" : "Nenhum Selecionado"})`;
      }
      return;
    }

    if (titleEl) {
      titleEl.textContent = `${isEn ? "Consensus Track" : "Trilha de Consenso"} (${modeName})`;
    }

    const data = this.calculateConsensus(activeStreams, this.viewerConsensusMode || "union");

    data.forEach((inv) => {
      const startPct = (inv.start / this.totalDuration) * 100;
      const widthPct = ((inv.end - inv.start) / this.totalDuration) * 100;
      const color = inv.label === "VERTICAL" ? "#ff9d1c" : "#38bdf8";

      const block = document.createElement("div");
      block.className = "interval-block";
      block.style.position = "absolute";
      block.style.left = `${startPct}%`;
      block.style.width = `${widthPct}%`;
      block.style.background = color;
      block.textContent = `${inv.label} (${inv.start.toFixed(1)}s - ${inv.end.toFixed(1)}s)`;
      lane.appendChild(block);
    });
  }

  drawViewerWaveform() {
    const canvas = document.getElementById("viewer-waveform-canvas");
    if (!canvas) return;
    const container = canvas.parentElement;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const width = rect.width || 680;
    const height = rect.height || 82;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext("2d");
    ctx.save();
    ctx.scale(dpr, dpr);

    // Clean background matching HIAAC paper theme
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    ctx.fillStyle = isDark ? "#161b22" : "#ece6d8";
    ctx.fillRect(0, 0, width, height);

    // Vertical time grid lines every 2 seconds
    ctx.lineWidth = 1;
    for (let sec = 2; sec <= 24; sec += 2) {
      const x = (sec / this.totalDuration) * width;
      const isMajor = sec % 4 === 0;
      ctx.strokeStyle = isDark 
        ? (isMajor ? "rgba(255, 255, 255, 0.12)" : "rgba(255, 255, 255, 0.04)")
        : (isMajor ? "rgba(0, 0, 0, 0.1)" : "rgba(0, 0, 0, 0.04)");
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();

      // Time tag at bottom for major ticks
      if (isMajor && sec < 24) {
        ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.45)" : "rgba(26, 30, 36, 0.55)";
        ctx.font = "8.5px 'JetBrains Mono', monospace";
        ctx.fillText(`${sec}s`, x + 3, height - 4);
      }
    }

    // Amplitude horizontal grid lines (-10, 0, +10 m/s²)
    const midY = height / 2;
    ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.22)" : "rgba(0, 0, 0, 0.2)"; // Center 0 baseline
    ctx.beginPath();
    ctx.moveTo(0, midY);
    ctx.lineTo(width, midY);
    ctx.stroke();

    ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.07)";
    const quarterH = height * 0.32;
    ctx.beginPath();
    ctx.moveTo(0, midY - quarterH);
    ctx.lineTo(width, midY - quarterH);
    ctx.moveTo(0, midY + quarterH);
    ctx.lineTo(width, midY + quarterH);
    ctx.stroke();

    // Amplitude scale indicators
    ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.45)" : "rgba(26, 30, 36, 0.5)";
    ctx.font = "8px 'JetBrains Mono', monospace";
    ctx.fillText("0", 4, midY - 2);
    ctx.fillText("+1g", 4, midY - quarterH + 8);
    ctx.fillText("-1g", 4, midY + quarterH - 2);

    const data = window.HIAAC_MOCK_DATA?.accelerometer;
    if (data && data.length > 0) {
      const count = data.length;
      const dur = this.totalDuration;
      const ampScale = quarterH / 9.8; // Normalized so ~9.8 m/s² (1g) reaches quarterH

      const drawSignal = (color, getY) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.35;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.beginPath();
        for (let i = 0; i < count; i++) {
          const pt = data[i];
          const x = (pt.t / dur) * width;
          const y = Math.max(2, Math.min(height - 2, midY - getY(pt) * ampScale));
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      };

      // Z Axis (Purple) - relative to 1g (gravity subtracted)
      drawSignal("#a855f7", (pt) => (pt.z - 9.8));
      // Y Axis (Cyan)
      drawSignal("#38bdf8", (pt) => pt.y);
      // X Axis (Orange)
      drawSignal("#ff9d1c", (pt) => pt.x);
    }

    ctx.restore();
  }
}

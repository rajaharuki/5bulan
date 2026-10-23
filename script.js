 /* ====== EDIT DI SINI ====== */
      const CONFIG = { her: "sayangg", me: "Raja", start: "2026-05-23T00:00:00" }; // ganti nama & tanggal jadian
      /* ========================== */
      document
        .querySelectorAll("[data-her]")
        .forEach((e) => (e.textContent = CONFIG.her));
      document
        .querySelectorAll("[data-me]")
        .forEach((e) => (e.textContent = CONFIG.me));

      // foto kosong -> tampilkan placeholder
      document.querySelectorAll(".photo").forEach((p) => {
        const i = p.querySelector("img"),
          f = () => p.classList.add("empty");
        if (i.complete && !i.naturalWidth) f();
        i.addEventListener("error", f);
      });

      // counter
      const st = new Date(CONFIG.start).getTime(),
        $ = (id) => document.getElementById(id);
      setInterval(() => {
        let t = Math.max(0, Date.now() - st) / 1e3;
        $("d").textContent = Math.floor(t / 86400);
        $("h").textContent = Math.floor((t % 86400) / 3600);
        $("m").textContent = Math.floor((t % 3600) / 60);
        $("s").textContent = Math.floor(t % 60);
      }, 1000);

      // reveal
      const io = new IntersectionObserver(
        (es) =>
          es.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("in");
              io.unobserve(e.target);
            }
          }),
        { threshold: 0.15 },
      );
      document.querySelectorAll(".rv").forEach((e) => io.observe(e));

      // flip + tilt
      document
        .querySelectorAll(".flip")
        .forEach((f) => (f.onclick = () => f.classList.toggle("on")));
      document.querySelectorAll(".tilt").forEach((c) => {
        c.addEventListener("mousemove", (e) => {
          const r = c.getBoundingClientRect(),
            x = (e.clientX - r.left) / r.width - 0.5,
            y = (e.clientY - r.top) / r.height - 0.5;
          c.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 14}deg)`;
        });
        c.addEventListener("mouseleave", () => (c.style.transform = ""));
      });

      // taman bunga SVG
      const cols = [
        "#ff9ebf",
        "#f7b6d2",
        "#d9b8f5",
        "#ffc9a8",
        "#ff86ab",
        "#fff0a8",
      ];
      document.querySelectorAll(".garden").forEach((g) => {
        for (let i = 0; i < 8; i++) {
          const s = 30 + Math.random() * 34,
            h = 40 + Math.random() * 80;
          g.insertAdjacentHTML(
            "beforeend",
            `<div class="fw" style="--s:${s}px;--h:${h}px;--c:${cols[i % cols.length]};--d:${i * 0.15}s;animation-delay:${-i}s"><svg><use href="#fl"/></svg><i></i></div>`,
          );
        }
      });

      // kejutan
      const em = ["🌸", "🌷", "💗", "🌹", "✨", "🦋", "💐", "🌼"];
      $("surprise").onclick = () => {
        for (let i = 0; i < 46; i++) {
          const b = document.createElement("span");
          b.className = "burst";
          b.textContent = em[i % em.length];
          b.style.left = Math.random() * 100 + "vw";
          b.style.bottom = "-30px";
          document.body.appendChild(b);
          b.animate(
            [
              { transform: "translateY(0) rotate(0)", opacity: 1 },
              {
                transform: `translate(${(Math.random() - 0.5) * 160}px,-${60 + Math.random() * 50}vh) rotate(${Math.random() * 540}deg)`,
                opacity: 0,
              },
            ],
            {
              duration: 2500 + Math.random() * 2200,
              easing: "ease-out",
              delay: Math.random() * 600,
            },
          ).onfinish = () => b.remove();
        }
      };

      // musik
      const a = $("bgm");
      $("mb").onclick = () => {
        a.paused
          ? (a.play().catch(() => {}), ($("mb").textContent = "🔊"))
          : (a.pause(), ($("mb").textContent = "🎵"));
      };

      // 3D bunga + kelopak jatuh (three.js)
      (() => {
        if (!window.THREE) return;
        const R = new THREE.WebGLRenderer({
          canvas: $("gl"),
          alpha: true,
          antialias: true,
        });
        R.setPixelRatio(Math.min(devicePixelRatio, 2));
        const S = new THREE.Scene(),
          C = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
        C.position.z = 7;
        S.add(new THREE.AmbientLight(0xffffff, 0.85));
        const dl = new THREE.DirectionalLight(0xffffff, 0.9);
        dl.position.set(3, 5, 5);
        S.add(dl);
        const pl = new THREE.PointLight(0xff9ec4, 0.9, 20);
        pl.position.set(-3, 1, 4);
        S.add(pl);
        const wrap = new THREE.Group(),
          fl = new THREE.Group();
        wrap.add(fl);
        wrap.rotation.x = 0.95;
        S.add(wrap);
        const pg = new THREE.SphereGeometry(1, 22, 14);
        pg.scale(0.42, 1, 0.14);
        pg.translate(0, 1, 0);
        [
          [7, 0.3, 0.8, 0xffe0ec],
          [9, 0.6, 0.9, 0xffc7dc],
          [11, 0.95, 1, 0xffb0cc],
          [13, 1.3, 1.05, 0xf79fc0],
        ].forEach(([n, t, s, c], i) => {
          const m = new THREE.MeshStandardMaterial({
            color: c,
            roughness: 0.5,
            metalness: 0.05,
            side: THREE.DoubleSide,
          });
          for (let k = 0; k < n; k++) {
            const piv = new THREE.Object3D(),
              h = new THREE.Object3D(),
              p = new THREE.Mesh(pg, m);
            piv.rotation.y = (k / n) * Math.PI * 2 + i * 0.35;
            h.rotation.x = t;
            h.scale.setScalar(s);
            h.add(p);
            piv.add(h);
            fl.add(piv);
          }
        });
        const core = new THREE.Mesh(
          new THREE.SphereGeometry(0.28, 20, 16),
          new THREE.MeshStandardMaterial({ color: 0xffd86b, roughness: 0.4 }),
        );
        core.position.y = 0.1;
        fl.add(core);
        const small = [];
        const lg = new THREE.SphereGeometry(0.14, 10, 8);
        lg.scale(1, 0.12, 0.6);
        const n = innerWidth < 700 ? 24 : 44;
        for (let i = 0; i < n; i++) {
          const m = new THREE.Mesh(
            lg,
            new THREE.MeshStandardMaterial({
              color: [0xffb6d0, 0xffd1e1, 0xe2cffb][i % 3],
              roughness: 0.6,
            }),
          );
          m.position.set(
            (Math.random() - 0.5) * 13,
            (Math.random() - 0.5) * 10,
            Math.random() * 4 - 2,
          );
          m.userData = {
            v: 0.006 + Math.random() * 0.012,
            ph: Math.random() * 6,
            r: Math.random() * 0.03,
          };
          S.add(m);
          small.push(m);
        }
        let mx = 0,
          my = 0,
          tx = 0,
          ty = 0,
          u = 1;
        const rs = () => {
          R.setSize(innerWidth, innerHeight);
          C.aspect = innerWidth / innerHeight;
          C.updateProjectionMatrix();
          wrap.scale.setScalar(innerWidth < 700 ? 0.62 : 0.9);
          u = (2 * Math.tan((25 * Math.PI) / 180) * 7) / innerHeight;
        };
        rs();
        addEventListener("resize", rs);
        addEventListener("pointermove", (e) => {
          tx = e.clientX / innerWidth - 0.5;
          ty = e.clientY / innerHeight - 0.5;
        });
        const clk = new THREE.Clock();
        (function loop() {
          requestAnimationFrame(loop);
          const t = clk.getElapsedTime();
          mx += (tx - mx) * 0.05;
          my += (ty - my) * 0.05;
          fl.rotation.y = t * 0.25;
          wrap.rotation.z = mx * 0.4;
          wrap.rotation.x = 0.95 + my * 0.3;
          wrap.position.y = 1.1 + Math.sin(t) * 0.1 + scrollY * u;
          wrap.visible = scrollY < innerHeight * 1.3;
          small.forEach((m, i) => {
            const d = m.userData;
            m.position.y -= d.v;
            m.position.x += Math.sin(t + d.ph) * 0.004;
            m.rotation.x += d.r;
            m.rotation.z += d.r * 0.7;
            if (m.position.y < -5.5) {
              m.position.y = 5.5;
              m.position.x = (Math.random() - 0.5) * 13;
            }
          });
          R.render(S, C);
        })();
      })();
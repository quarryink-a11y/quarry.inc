"use client";

import type { Review } from "@shared/types/api";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface DisplayReview {
  text: string;
  name: string;
  role: string;
  photo: string | null;
  link: string | null;
}

function AmbientCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl");
    if (!gl) return;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);
    const vert = `attribute vec2 a_pos; void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }`;
    const frag = `precision mediump float; uniform float u_time; uniform vec2 u_res; void main() { vec2 uv = gl_FragCoord.xy / u_res; float t = u_time * 0.18; float v = sin(uv.x * 4.0 + t) * 0.5 + 0.5; v *= sin(uv.y * 3.0 + t * 0.7) * 0.5 + 0.5; v *= sin((uv.x + uv.y) * 2.5 + t * 0.4) * 0.5 + 0.5; float intensity = v * 0.04; gl_FragColor = vec4(intensity, intensity * 0.95, intensity * 0.9, 1.0); }`;
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vert));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, frag));
    gl.linkProgram(prog);
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const loc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uRes = gl.getUniformLocation(prog, "u_res");
    let raf: number;
    const draw = (t: number) => {
      gl.uniform1f(uTime, t * 0.001);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  );
}

interface ReviewsSectionProps {
  reviews?: Review[];
}

export function ReviewsSection({ reviews: reviewsProp }: ReviewsSectionProps) {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [expanded, setExpanded] = useState(false);
  const TEXT_LIMIT = 200;

  if (!reviewsProp?.length) return null;

  const reviews: DisplayReview[] = reviewsProp.map((r) => ({
    text: r.review_text,
    name: r.client_name ?? "",
    role: r.review_source ?? "client",
    photo: r.client_image_url ?? null,
    link: r.client_profile_url ?? null,
  }));

  const go = (d: number) => {
    setDir(d);
    setExpanded(false);
    setIndex((prev) => (prev + d + reviews.length) % reviews.length);
  };

  return (
    <section
      id="reviews"
      className="relative bg-[#020202] py-12 md:py-20 px-6 md:px-16 overflow-hidden"
    >
      <AmbientCanvas />
      <AnimatePresence mode="wait">
        <motion.div
          key={`num-${index}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.7 }}
          className="absolute right-6 md:right-16 top-1/2 -translate-y-1/2 font-serif-display leading-none text-white/[0.03] select-none pointer-events-none font-light"
          style={{ fontSize: "clamp(180px, 28vw, 380px)" }}
          aria-hidden
        >
          {String(index + 1).padStart(2, "0")}
        </motion.div>
      </AnimatePresence>

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.9 }}
          viewport={{ once: true }}
          className="label-caps text-white/35 mb-16"
        >
          Reviews
        </motion.p>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          style={{ originX: 0 }}
          className="h-px bg-white/10 mb-16"
        />

        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={index}
            custom={dir}
            initial={{ opacity: 0, x: dir * 70, filter: "blur(8px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: dir * -70, filter: "blur(8px)" }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            style={{ maxWidth: "820px" }}
          >
            <div className="mb-14">
              <p className="font-serif-display text-[26px] md:text-[40px] leading-[1.5] text-white/75 font-light tracking-tight italic">
                &ldquo;
                {reviews[index].text.length > TEXT_LIMIT && !expanded
                  ? reviews[index].text.slice(0, TEXT_LIMIT).trimEnd() + "…"
                  : reviews[index].text}
                &rdquo;
              </p>
              {reviews[index].text.length > TEXT_LIMIT && !expanded && (
                <button
                  onClick={() => setExpanded(true)}
                  className="mt-4 text-[11px] tracking-[0.15em] uppercase text-white/30 hover:text-white/60 border-b border-white/15 hover:border-white/40 pb-0.5 transition-all duration-300"
                >
                  Read more
                </button>
              )}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                {reviews[index].photo ? (
                  <img
                    src={reviews[index].photo}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover border border-white/10 flex-shrink-0"
                  />
                ) : (
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    style={{ originY: 0 }}
                    className="w-px h-8 bg-white/20"
                  />
                )}
                <div>
                  {reviews[index].link ? (
                    <a
                      href={reviews[index].link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[12px] text-white/70 hover:text-white/90 decoration-white/20 font-light tracking-widest mb-0.5 transition-colors underline underline-offset-2"
                    >
                      {reviews[index].name}
                    </a>
                  ) : (
                    <p className="text-[12px] text-white/70 font-light tracking-widest mb-0.5">
                      {reviews[index].name}
                    </p>
                  )}
                  <p className="label-caps text-white/25">
                    {reviews[index].role}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-5">
                <span className="label-caps text-white/15">
                  {index + 1} / {reviews.length}
                </span>
                <button
                  onClick={() => go(-1)}
                  className="w-10 h-10 flex items-center justify-center border border-white/10 text-white/40 hover:text-white hover:border-white/50 transition-all duration-400 text-[18px]"
                  aria-label="prev"
                >
                  &larr;
                </button>
                <button
                  onClick={() => go(1)}
                  className="w-10 h-10 flex items-center justify-center border border-white/10 text-white/40 hover:text-white hover:border-white/50 transition-all duration-400 text-[18px]"
                  aria-label="next"
                >
                  &rarr;
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

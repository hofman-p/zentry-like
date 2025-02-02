'use client';
import { motion, useAnimation, useScroll, useTransform } from 'motion/react';
import React, { useEffect, useRef, useState } from 'react';
import { TiLocationArrow } from 'react-icons/ti';
import Button from './Button';

const Hero: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [backgroundIndex, setBackgroundIndex] = useState(1);
  const [hasClicked, setHasClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const nextVideoControls = useAnimation();
  const previewControls = useAnimation();

  const totalVideos = 4;
  const nextVideoRef = useRef<HTMLVideoElement>(null);

  const getNextIndex = (index: number) =>
    (index % totalVideos) + 1 === totalVideos ? 1 : (index % totalVideos) + 1;

  const upcomingVideoIndex = getNextIndex(currentIndex);

  const handleMiniVideoClick = () => {
    if (isAnimating) return;

    // Update current index immediately for preview
    setCurrentIndex(upcomingVideoIndex);
    // Start animation sequence
    setIsAnimating(true);
    setHasClicked(true);
    // Reset and immediately animate preview scale
    previewControls.set({ scale: 0 });
    previewControls.start({
      scale: 1,
      transition: {
        duration: 1,
        ease: [0.4, 0, 0.2, 1],
      },
    });
  };

  useEffect(() => {
    const preloadVideos = async () => {
      const videoPromises = Array.from({ length: totalVideos }, (_, index) => {
        const video = document.createElement('video');
        video.src = getVideoSrc(index + 1);
        video.preload = 'auto';
        return new Promise<void>((resolve) => {
          video.onloadeddata = () => resolve();
          video.onerror = () => resolve(); // Resolve on error to avoid blocking
        });
      });

      await Promise.all(videoPromises);
      setIsLoading(false); // Ensure loader disappears after all videos are processed
    };

    preloadVideos();
  }, []);

  useEffect(() => {
    if (hasClicked && isAnimating) {
      // Start with visibility visible but scaled down
      nextVideoControls.set({
        visibility: 'visible',
        scale: 0.25,
      });

      // Start video playback and scale up to full screen
      if (nextVideoRef.current) {
        nextVideoRef.current.play();
      }

      nextVideoControls
        .start({
          scale: 1,
          width: '100%',
          height: '100%',
          transition: {
            duration: 1,
            ease: [0.4, 0, 0.2, 1], // power1.inOut equivalent
          },
        })
        .then(() => {
          // Animation complete
          nextVideoControls.set({
            visibility: 'hidden',
            scale: 0.25,
          });
          // Update background video
          setBackgroundIndex(currentIndex);
          setHasClicked(false);
          setIsAnimating(false);
        });
    }
  }, [
    hasClicked,
    isAnimating,
    nextVideoControls,
    previewControls,
    currentIndex,
  ]);

  const { scrollYProgress } = useScroll();
  const clipPath = useTransform(
    scrollYProgress,
    [0, 1],
    [
      'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
      'polygon(14% 0%, 72% 0%, 90% 70%, 0% 100%)',
    ],
  );

  const getVideoSrc = (index: number) => `videos/hero-${index}.mp4`;

  return (
    <div className="relative h-dvh w-screen overflow-x-hidden">
      {isLoading && (
        <div className="flex-center absolute z-100 h-dvh w-screen overflow-hidden bg-violet-50">
          <div className="three-body">
            <div className="three-body__dot" />
            <div className="three-body__dot" />
            <div className="three-body__dot" />
          </div>
        </div>
      )}
      <motion.div
        id="video-frame"
        className="bg-blue-75 relative z-10 h-dvh w-screen overflow-hidden"
        style={{ clipPath, borderRadius: '0 0 0 0' }}
      >
        <div>
          <div className="mask-clip-path absolute-center group z-50 size-64 overflow-hidden rounded-lg md:size-96">
            {/* Preview of next video - only visible on hover */}
            <motion.div
              onClick={handleMiniVideoClick}
              animate={previewControls}
              initial={{ scale: 1 }}
              className="invisible origin-center cursor-pointer opacity-0 transition-opacity duration-300 ease-in group-hover:visible group-hover:opacity-100"
            >
              <video
                className="size-64 object-cover object-center md:size-96"
                src={getVideoSrc(upcomingVideoIndex)}
                loop
                muted
                playsInline
              />
            </motion.div>
          </div>

          {/* Next video for the fullscreen transition */}
          <motion.video
            ref={nextVideoRef}
            src={getVideoSrc(currentIndex)}
            loop
            muted
            playsInline
            id="next-video"
            className="absolute-center invisible z-20 size-64 object-cover object-center md:size-96"
            initial={{ scale: 0.25 }}
            animate={nextVideoControls}
          />

          {/* Current background video */}
          <video
            src={getVideoSrc(backgroundIndex)}
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-0 left-0 size-full object-cover object-center"
          />
        </div>
        <h1 className="special-font hero-heading text-blue-75 absolute right-5 bottom-5 z-40">
          G<b>a</b>ming
        </h1>
        <div className="absolute top-0 left-0 z-40 size-full">
          <div className="mt-24 px-5 sm:px-10">
            <h1 className="special-font hero-heading text-blue-100">
              Redefi<b>n</b>e
            </h1>
            <p className="mb-5 max-w-64 text-blue-100">
              Enter the Metagame Layer <br />
              Unleash the Play Economy
            </p>
            <Button
              id="watch-trailer"
              label="Watch Trailer"
              leftIcon={<TiLocationArrow />}
              containerClass="bg-yellow-300 flex-center gap-1"
            />
          </div>
        </div>
      </motion.div>
      <h1 className="special-font hero-heading absolute right-5 bottom-5 text-black">
        G<b>a</b>ming
      </h1>
    </div>
  );
};

export default Hero;

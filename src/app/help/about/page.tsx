import { Button } from '@/components/ui/button';
import { siteContent } from '@/config/siteConfig';
import { IconArrowRight, IconBulb, IconGlobe, IconHeartHandshake } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About - Match4Good',
};

// Output: <title>Acme</title>

export default function AboutUsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/** Banner */}
      <section className="flex flex-col">
        <div className="flex items-center h-80 overflow-hidden relative">
          <Image
            src={'/about-background.jpg'}
            alt="Banner Image"
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className="flex flex-col bg-primary justify-center text-center items-center p-8 space-y-2">
          <h2 className="text-3xl font-semibold text-primary-foreground">About Us</h2>
          <h3 className="text-xl text-primary-foreground">{siteContent.tagLine}</h3>
        </div>
      </section>
      {/** Our Story */}
      <section className="flex flex-col text-center justify-between p-12 md:p-16 lg:p-24 xl:px-80 space-y-10">
        <h2 className="text-primary text-2xl md:text-4xl font-semibold">Our Story</h2>
        {siteContent.story.map((paragraph, index) => (
          <p key={index} className="text-base md:text-lg">
            {paragraph}
            <br />
          </p>
        ))}
        <div className="flex flex-col self-center justify-center basis-3/7 size-60">
          <Image
            src={'/logo_extended.svg'}
            width={392}
            height={73}
            alt="Match4Good logo"
            className="hidden md:block"
          />
        </div>
      </section>
      {/** Mission Statement */}
      <section className="flex flex-col bg-accent text-accent-foreground text-center justify-center p-12 md:p-16 lg:p-24 xl:px-80 space-y-10">
        <h2 className="text-primary text-2xl md:text-4xl font-semibold">Our Mission</h2>
        <p className="text-base md:text-lg">{siteContent.missionStatement}</p>
      </section>
      {/** Values*/}
      <section className="flex flex-col items-center space-y-5 md:space-y-10 justify-center p-5 md:p-16 lg:p-24 xl:px-80">
        <div className="grid grid-rows-3 md:grid-rows-none md:grid-cols-3 p-8 gap-10 md:gap-20">
          <div className="flex flex-col justify-start items-center space-y-3">
            <IconHeartHandshake size={50} className="text-primary" />
            <h3 className="text-xl font-semibold text-primary">
              {siteContent.coreValues[0].value}
            </h3>
            <p className="text-wrap text-center">{siteContent.coreValues[0].description}</p>
          </div>
          <div className="flex flex-col justify-start items-center space-y-3">
            <IconGlobe size={50} className="text-primary" />
            <h3 className="text-xl font-semibold text-primary">
              {siteContent.coreValues[1].value}
            </h3>
            <p className="text-wrap text-center">{siteContent.coreValues[1].description}</p>
          </div>
          <div className="flex flex-col justify-start items-center space-y-3">
            <IconBulb size={50} className="text-primary" />
            <h3 className="text-xl font-semibold text-primary">
              {siteContent.coreValues[2].value}
            </h3>
            <p className="text-wrap text-center">{siteContent.coreValues[2].description}</p>
          </div>
        </div>
      </section>
      {/** Contact */}
      <section className="flex flex-col md:flex-row md:h-80 overflow-hidden">
        <div className="flex items-center basis-4/7 overflow-hidden relative">
          <Image
            src={'/contact-background.jpg'}
            alt="Contact Image"
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className="flex flex-col bg-primary justify-center items-left p-12 basis-3/7 space-y-10">
          <h2 className="text-xl lg:text-2xl xl:text-3xl text-primary-foreground">
            {siteContent.contactDescription}
          </h2>
          <div className="flex space-x-5">
            <Link href={'/help/contact-us/'}>
              <Button variant={'secondary'} className="cursor-pointer" size={'lg'}>
                Contact us
                <IconArrowRight />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

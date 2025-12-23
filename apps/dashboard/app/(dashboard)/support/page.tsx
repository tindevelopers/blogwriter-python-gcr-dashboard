'use client'

import { Heading, Subheading } from '@repo/ui/heading'
import { Button } from '@repo/ui/button'
import { Field, FieldLabel, Fieldset, Legend } from '@repo/ui/fieldset'
import { Input } from '@repo/ui/input'
import { Textarea } from '@repo/ui/textarea'
import { DescriptionDetails, DescriptionList, DescriptionTerm } from '@repo/ui/description-list'

export default function SupportPage() {
  return (
    <>
      <Heading>Support</Heading>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div>
          <Subheading>Get Help</Subheading>
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
            Need assistance? Contact our support team or check the resources below.
          </p>

          <div className="mt-6">
            <DescriptionList>
              <DescriptionTerm>Email Support</DescriptionTerm>
              <DescriptionDetails>
                <a href="mailto:support@example.com" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
                  support@example.com
                </a>
              </DescriptionDetails>
              <DescriptionTerm>Response Time</DescriptionTerm>
              <DescriptionDetails>Within 24 hours</DescriptionDetails>
              <DescriptionTerm>Documentation</DescriptionTerm>
              <DescriptionDetails>
                <a
                  href="https://docs.example.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  View Documentation →
                </a>
              </DescriptionDetails>
            </DescriptionList>
          </div>
        </div>

        <div>
          <Subheading>Contact Form</Subheading>
          <form className="mt-4" onSubmit={(e) => e.preventDefault()}>
            <Fieldset>
              <Field>
                <FieldLabel>Your Email</FieldLabel>
                <Input name="email" type="email" placeholder="your@email.com" required />
              </Field>
              <Field>
                <FieldLabel>Subject</FieldLabel>
                <Input name="subject" placeholder="What can we help you with?" required />
              </Field>
              <Field>
                <FieldLabel>Message</FieldLabel>
                <Textarea
                  name="message"
                  rows={6}
                  placeholder="Describe your issue or question..."
                  required
                />
              </Field>
              <div className="mt-6">
                <Button type="submit">Send Message</Button>
              </div>
            </Fieldset>
          </form>
        </div>
      </div>

      <div className="mt-12 rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-900/20">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100">Common Questions</h3>
        <ul className="mt-4 space-y-2 text-sm text-blue-800 dark:text-blue-200">
          <li>• How do I configure AI providers?</li>
          <li>• How do I view system logs?</li>
          <li>• How do I manage secrets and environment variables?</li>
          <li>• How do I monitor job status?</li>
        </ul>
      </div>
    </>
  )
}


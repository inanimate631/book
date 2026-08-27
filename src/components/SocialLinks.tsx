import envelope from '../assets/envelope.svg'
import linkedin from '../assets/linkedin.svg'
import threads from '../assets/Threads (1).svg'

type SocialLinksProps = {
  footer?: boolean
}

const socialLinks = [
  { href: 'https://www.linkedin.com/in/denys-kiiashko', label: 'LinkedIn', icon: linkedin },
  { href: 'https://www.threads.com/@mrfiordin', label: 'Threads', icon: threads },
  { href: 'mailto:info@denkiiashko.com', label: 'Email', icon: envelope },
]

export function SocialLinks({ footer = false }: SocialLinksProps) {
  return (
    <div
      className={`socials ${footer ? 'socials--footer' : ''}`}
      aria-label="Соціальні мережі"
    >
      {socialLinks.map((link) => (
        <a key={link.label} href={link.href} aria-label={link.label} target={link.href.startsWith('http') ? '_blank' : undefined} rel={link.href.startsWith('http') ? 'noreferrer' : undefined}>
          <img src={link.icon} alt="" aria-hidden="true" />
        </a>
      ))}
    </div>
  )
}

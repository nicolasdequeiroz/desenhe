import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

/**
 * Redirect client-side para URLs antigas do site Wix.
 * (No SSG o redirect só pode acontecer no cliente; o GitHub Pages
 * serve o 404.html, o router assume e troca a URL.)
 */
export function Redirect({to}: {to: string}) {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(to, {replace: true});
  }, [navigate, to]);
  return null;
}

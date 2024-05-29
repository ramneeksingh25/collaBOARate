import { KeycloakTokenParsed } from 'keycloak-js';
import { createContext } from 'react';

type UserContextType = {
    keycloakTokenParsed?: KeycloakTokenParsed | undefined;
  };
  
export const userContext = createContext<UserContextType>("");
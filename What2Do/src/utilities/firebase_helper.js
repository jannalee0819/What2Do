import { useEffect, useState, useCallback} from 'react'; 
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { firebase } from './firebase';  

export const signInWithGoogle = () => {
    signInWithPopup(getAuth(firebase), new GoogleAuthProvider());
};

const firebaseSignOut = () => signOut(getAuth(firebase));

export { firebaseSignOut as signOut };

export const useAuthState = () => {
    const [user, setUser] = useState();

    useEffect(() => (
        onAuthStateChanged(getAuth(firebase), setUser)
    ), []);

    return [user];
};
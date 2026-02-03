//TODO Create a hook that manages current profile state and
//updates to local storage

import { useState } from 'react';

//T is a generic type that is flexible with inital's data types
export function useProfileState<T extends Record<string, any>>(inital: T) {
    const [state, setState] = useState<T>(inital)

    //K type is based on T generic type
    function resolve<K extends keyof T>(key: K) {
        return {
            stateValue: state[key],
            get: () => state[key],
            set: (value: T[K]) =>
                setState(prev => {
                    return {...prev, [key]: value}
                })
        }
    }

    return resolve
}
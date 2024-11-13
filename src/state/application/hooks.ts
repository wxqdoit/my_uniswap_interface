import {useCallback} from 'react'
import {useAppDispatch, useAppSelector} from '../hooks'


import {AppState} from '../index'
import {
    AppModal,
    setCloseModal,
    setOpenModal,
    setToken,

} from './reducer'

export function useModalIsOpen(modal: AppModal): boolean {
    const openModal = useAppSelector((state: AppState) => state.application.modalStatus)
    return openModal === modal
}
export function useToken(): string {
    return useAppSelector((state: AppState) => state.application.token)
}

export function useToggleModal(modal: AppModal): () => void {
    const isOpen = useModalIsOpen(modal)
    const dispatch = useAppDispatch()
    return useCallback(() => dispatch(setOpenModal(isOpen ? null : modal)), [dispatch, modal, isOpen])
}

export function useCloseModal(): () => void {
    const dispatch = useAppDispatch()
    return useCallback(() => dispatch(setCloseModal()), [dispatch])
}


export function useSetToken(){

    const dispatch = useAppDispatch()
    const onSetToken = useCallback((token:string) => {
        dispatch(setToken(token))
    }, [dispatch, setToken])
    return {onSetToken}

}

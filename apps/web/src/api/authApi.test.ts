import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mockear el módulo axios antes de importar authApi
vi.mock('@/api/axios', () => {
  const mockInstance = {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  }
  return { default: mockInstance }
})

import api from '@/api/axios'
import { signUpUserRequest } from '@/api/authApi'

const mockedApi = vi.mocked(api)

describe('authApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('signUpUserRequest', () => {
    it('llama a POST /users con los datos correctos', async () => {
      const mockResponse = { data: { id: 1, username: 'test' } }
      mockedApi.post.mockResolvedValue(mockResponse)

      const formData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        username: 'juanp',
        email: 'juan@test.com',
        password: '123456',
        phone: '099123456',
      }

      const result = await signUpUserRequest(formData)

      expect(mockedApi.post).toHaveBeenCalledWith('users', formData)
      expect(result).toEqual({ id: 1, username: 'test' })
    })

    it('tira error si la respuesta no tiene datos', async () => {
      mockedApi.post.mockResolvedValue({ data: null })

      await expect(
        signUpUserRequest({
          firstName: 'Juan',
          lastName: 'Pérez',
          username: 'juanp',
          email: 'juan@test.com',
          password: '123456',
          phone: '099123456',
        })
      ).rejects.toThrow('No hay datos en la respuesta de registro')
    })

    it('propaga errores del servidor', async () => {
      mockedApi.post.mockRejectedValue(new Error('Email ya registrado'))

      await expect(
        signUpUserRequest({
          firstName: 'Juan',
          lastName: 'Pérez',
          username: 'juanp',
          email: 'juan@test.com',
          password: '123456',
          phone: '099123456',
        })
      ).rejects.toThrow('Email ya registrado')
    })
  })
})

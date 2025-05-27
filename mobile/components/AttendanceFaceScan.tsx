import { CameraView, useCameraPermissions } from 'expo-camera'
import { FaceDetector } from 'expo-face-detector'

export function AttendanceFaceScan() {
  const [permission, requestPermission] = useCameraPermissions()
  const [scanning, setScanning] = useState(false)

  const handleFacesDetected = async ({ faces }) => {
    if (faces.length > 0 && !scanning) {
      setScanning(true)
      const employee = await verifyEmployeeFace(faces[0])
      if (employee) {
        // Handle clock in/out logic
      }
      setScanning(false)
    }
  }

  const verifyEmployeeFace = async (face) => {
    const { data } = await supabase.rpc('verify_employee_face', {
      face_embedding: face.embedding,
      threshold: 0.8
    })
    return data
  }

  return (
    <CameraView
      facing="front"
      onFacesDetected={handleFacesDetected}
      faceDetectorSettings={{
        mode: FaceDetector.FaceDetectorMode.fast,
        detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
        runClassifications: FaceDetector.FaceDetectorClassifications.none,
        minDetectionInterval: 1000,
        tracking: true,
      }}
    />
  )
} 
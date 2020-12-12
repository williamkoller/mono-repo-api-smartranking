import { BadGatewayException, PipeTransform } from '@nestjs/common'
import { ChallengeStatus } from '../enum/challenge-status.enum'

export class ChallengeStatusValidationPipe implements PipeTransform {
  readonly statusAllowed = [ChallengeStatus.ACCEPT, ChallengeStatus.DENIED, ChallengeStatus.CANCELED]
  transform(value: any) {
    const status = value.status.toUpperCase()
    if (!this.isStatusValid(status)) {
      throw new BadGatewayException(`${status} status is invalid.`)
    }
    return value
  }

  private isStatusValid(status: any) {
    const idx = this.statusAllowed.indexOf(status)
    return idx !== -1
  }
}
